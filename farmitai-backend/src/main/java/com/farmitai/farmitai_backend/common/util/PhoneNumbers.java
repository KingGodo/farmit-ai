package com.farmitai.farmitai_backend.common.util;

import java.util.regex.Pattern;

public final class PhoneNumbers {

	private static final Pattern E164 = Pattern.compile("^\\+[1-9]\\d{7,14}$");

	private PhoneNumbers() {
	}

	public static boolean isE164(String phone) {
		return phone != null && E164.matcher(phone).matches();
	}

	public static String requireE164(String phone) {
		if (!isE164(phone)) {
			throw new IllegalArgumentException("must be E.164");
		}
		return phone;
	}
}
