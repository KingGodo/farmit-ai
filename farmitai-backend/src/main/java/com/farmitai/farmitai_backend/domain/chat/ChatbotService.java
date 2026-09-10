package com.farmitai.farmitai_backend.domain.chat;

import com.farmitai.farmitai_backend.common.dto.PaginatedData;
import com.farmitai.farmitai_backend.common.exception.ApiException;
import com.farmitai.farmitai_backend.common.exception.ErrorCode;
import com.farmitai.farmitai_backend.common.util.Pages;
import com.farmitai.farmitai_backend.common.util.PersonNames;
import com.farmitai.farmitai_backend.domain.admin.dto.AdminDtos;
import com.farmitai.farmitai_backend.domain.agronomist.AgronomistProfileRepository;
import com.farmitai.farmitai_backend.domain.chat.dto.ChatDtos;
import com.farmitai.farmitai_backend.domain.farmer.FarmerProfileRepository;
import com.farmitai.farmitai_backend.domain.user.RoleName;
import com.farmitai.farmitai_backend.domain.user.RoleRepository;
import com.farmitai.farmitai_backend.domain.user.User;
import com.farmitai.farmitai_backend.domain.user.UserRepository;
import com.farmitai.farmitai_backend.domain.waitinglist.WaitingListRepository;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChatbotService {

	private final ConversationRepository conversationRepository;
	private final ChatMessageRepository chatMessageRepository;
	private final WhatsAppAccountRepository whatsAppAccountRepository;
	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final FarmerProfileRepository farmerProfileRepository;
	private final AgronomistProfileRepository agronomistProfileRepository;
	private final WaitingListRepository waitingListRepository;

	public ChatbotService(
			ConversationRepository conversationRepository,
			ChatMessageRepository chatMessageRepository,
			WhatsAppAccountRepository whatsAppAccountRepository,
			UserRepository userRepository,
			RoleRepository roleRepository,
			FarmerProfileRepository farmerProfileRepository,
			AgronomistProfileRepository agronomistProfileRepository,
			WaitingListRepository waitingListRepository) {
		this.conversationRepository = conversationRepository;
		this.chatMessageRepository = chatMessageRepository;
		this.whatsAppAccountRepository = whatsAppAccountRepository;
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.farmerProfileRepository = farmerProfileRepository;
		this.agronomistProfileRepository = agronomistProfileRepository;
		this.waitingListRepository = waitingListRepository;
	}

	@Transactional
	public ChatDtos.SendMessageResponse send(UUID userId, ChatDtos.SendMessageRequest request) {
		User user = userRepository.findById(userId).orElseThrow(() -> new ApiException(ErrorCode.UNAUTHENTICATED));
		ConversationChannel channel = request.channel() == null ? ConversationChannel.APP : request.channel();
		Conversation conversation = conversationFor(user, channel);
		chatMessageRepository.save(ChatMessage.text(conversation, MessageSender.FARMER, request.content()));
		ChatMessage reply = chatMessageRepository.save(
				ChatMessage.text(conversation, MessageSender.BOT, replyTo(request.content())));
		conversation.touch();
		return new ChatDtos.SendMessageResponse(toConversation(conversation), toMessage(reply));
	}

	@Transactional(readOnly = true)
	public ChatDtos.ConversationResponse myConversation(UUID userId, ConversationChannel channel) {
		User user = userRepository.findById(userId).orElseThrow(() -> new ApiException(ErrorCode.UNAUTHENTICATED));
		Conversation conversation = conversationRepository
				.findByUser_IdAndChannel(user.getId(), channel == null ? ConversationChannel.APP : channel)
				.orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
		return toConversation(conversation);
	}

	@Transactional
	public void ingestWhatsApp(String phone, String whatsappId, String text) {
		if (phone == null || phone.isBlank() || text == null || text.isBlank()) {
			return;
		}
		String e164 = phone.startsWith("+") ? phone : "+" + phone;
		User user = userRepository.findByPhone(e164).orElseGet(() -> {
			User created = User.farmer(e164);
			roleRepository.findByName(RoleName.FARMER).ifPresent(created::addRole);
			return userRepository.save(created);
		});
		if (user.getRoles().isEmpty()) {
			roleRepository.findByName(RoleName.FARMER).ifPresent(user::addRole);
		}
		whatsAppAccountRepository.findByPhoneNumber(e164).orElseGet(() -> whatsAppAccountRepository.save(
				WhatsAppAccount.link(user, e164, whatsappId)));
		ChatDtos.SendMessageRequest request = new ChatDtos.SendMessageRequest(text, ConversationChannel.WHATSAPP);
		send(user.getId(), request);
	}

	@Transactional(readOnly = true)
	public PaginatedData<AdminDtos.ConversationItem> list(ConversationChannel channel, String q, int page, int size) {
		Page<Conversation> result =
				conversationRepository.findAll(filters(channel, q), Pages.newest(page, size, "lastMessageAt"));
		return PaginatedData.from(result.map(this::toAdminItem));
	}

	@Transactional(readOnly = true)
	public AdminDtos.ConversationDetail get(UUID id) {
		Conversation conversation =
				conversationRepository.findById(id).orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
		List<AdminDtos.MessageItem> messages = chatMessageRepository
				.findByConversation_IdOrderByCreatedAtAsc(id)
				.stream()
				.map(ChatbotService::toAdminMessage)
				.toList();
		User user = conversation.getUser();
		return new AdminDtos.ConversationDetail(
				conversation.getId(),
				user.getId(),
				displayName(user),
				user.getPhone(),
				conversation.getChannel().name(),
				conversation.getStartedAt(),
				conversation.getLastMessageAt(),
				messages);
	}

	private Conversation conversationFor(User user, ConversationChannel channel) {
		return conversationRepository
				.findByUser_IdAndChannel(user.getId(), channel)
				.orElseGet(() -> conversationRepository.save(Conversation.open(user, channel)));
	}

	private ChatDtos.ConversationResponse toConversation(Conversation conversation) {
		List<ChatDtos.MessageResponse> messages = chatMessageRepository
				.findByConversation_IdOrderByCreatedAtAsc(conversation.getId())
				.stream()
				.map(ChatbotService::toMessage)
				.toList();
		return new ChatDtos.ConversationResponse(
				conversation.getId(),
				conversation.getChannel().name(),
				conversation.getStartedAt(),
				conversation.getLastMessageAt(),
				messages);
	}

	private AdminDtos.ConversationItem toAdminItem(Conversation conversation) {
		User user = conversation.getUser();
		List<ChatMessage> messages =
				chatMessageRepository.findByConversation_IdOrderByCreatedAtAsc(conversation.getId());
		String last = messages.isEmpty() ? "" : Optional.ofNullable(messages.get(messages.size() - 1).getContent()).orElse("");
		return new AdminDtos.ConversationItem(
				conversation.getId(),
				user.getId(),
				displayName(user),
				user.getPhone(),
				conversation.getChannel().name(),
				last,
				conversation.getLastMessageAt());
	}

	private String displayName(User user) {
		return farmerProfileRepository
				.findByUser_Id(user.getId())
				.map(profile -> PersonNames.display(profile.getFirstName(), profile.getLastName()))
				.or(() -> agronomistProfileRepository
						.findByUser_Id(user.getId())
						.map(profile -> PersonNames.display(profile.getFirstName(), profile.getLastName())))
				.or(() -> waitingListRepository.findByUserId(user.getId()).map(entry -> entry.getName()))
				.orElse(user.getPhone());
	}

	private static Specification<Conversation> filters(ConversationChannel channel, String q) {
		return (root, query, cb) -> {
			if (query.getResultType() != Long.class && query.getResultType() != long.class) {
				root.fetch("user");
			}
			query.distinct(true);
			List<Predicate> predicates = new ArrayList<>();
			if (channel != null) {
				predicates.add(cb.equal(root.get("channel"), channel));
			}
			if (q != null && !q.isBlank()) {
				var user = root.join("user");
				predicates.add(cb.like(user.get("phone"), "%" + q + "%"));
			}
			return cb.and(predicates.toArray(Predicate[]::new));
		};
	}

	static String replyTo(String content) {
		String text = content == null ? "" : content.toLowerCase(Locale.ROOT);
		if (text.contains("fall armyworm") || text.contains("army worm") || text.contains("armyworm")) {
			return "That sounds like fall armyworm. Check maize funnels for larvae, apply an approved insecticide early, and send a leaf photo so FarmIt can confirm.";
		}
		if (text.contains("disease") || text.contains("spot") || text.contains("yellow") || text.contains("leaf")) {
			return "Send a clear photo of the affected leaf on WhatsApp. FarmIt will name the problem and list treatment options, including nearby agro shops.";
		}
		if (text.contains("wait") || text.contains("list") || text.contains("join")) {
			return "Join the waiting list on farmitai.co.zw. Crop advice on WhatsApp starts after your place is approved.";
		}
		return "FarmIt received your message. Ask about a crop problem, send a leaf photo, or join the waiting list on farmitai.co.zw.";
	}

	private static ChatDtos.MessageResponse toMessage(ChatMessage message) {
		return new ChatDtos.MessageResponse(
				message.getId(),
				message.getSender().name(),
				message.getMessageType().name(),
				message.getContent(),
				message.getStatus().name(),
				message.getCreatedAt());
	}

	private static AdminDtos.MessageItem toAdminMessage(ChatMessage message) {
		return new AdminDtos.MessageItem(
				message.getId(),
				message.getSender().name(),
				message.getMessageType().name(),
				message.getContent(),
				message.getStatus().name(),
				message.getCreatedAt());
	}
}
