import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout, { LegalSection } from "@/components/landing/LegalLayout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy Policy — ${site.name}`,
  description:
    "How FarmIT AI collects and uses personal information from the waiting list and the FarmIT service.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="26 August 2026">
      <LegalSection title="Who we are">
        <p>
          FarmIT AI (“FarmIT”, “we”, “us”) provides an AI farming assistant
          for Zimbabwean farmers. This policy explains how we handle personal
          information when you use this website or join the waiting list. The
          waiting list is collected on this website only, not through WhatsApp.
        </p>
      </LegalSection>

      <LegalSection title="What we collect">
        <p>If you join the waiting list, we collect:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Full name</li>
          <li>Phone number</li>
          <li>Email address</li>
          <li>District</li>
          <li>Main crop</li>
          <li>Farming type</li>
        </ul>
        <p>
          We do not ask for payment details on this site. When you use FarmIT
          on WhatsApp, we may also process leaf photos and chat messages to
          provide crop advice. We will keep this policy current as the
          service expands.
        </p>
      </LegalSection>

      <LegalSection title="Why we use it">
        <p>We use waiting-list details to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Hold your place and contact you to complete registration</li>
          <li>Understand which districts and crops to support</li>
          <li>Improve FarmIT for Zimbabwean farmers</li>
        </ul>
        <p>
          We do not sell your information. We do not use it for unrelated
          advertising.
        </p>
      </LegalSection>

      <LegalSection title="How we store and share it">
        <p>
          Waiting-list information is stored so we can reach you and complete
          registration. Access is limited to people who need it to run
          FarmIT.
        </p>
        <p>
          We may use trusted service providers (for example hosting or email)
          to operate the site. They may only use your information to provide
          that service to us.
        </p>
        <p>
          We may share information if the law requires it, or to protect
          farmers, FarmIT, or others from harm.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>
          We keep waiting-list details until you ask us to delete them, or
          until they are no longer needed to provide FarmIT — whichever comes
          first. If you become a registered user, that account will follow the
          policy in force at that time.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          You can ask us to access, correct, or delete your waiting-list
          details. Email us at{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-ink underline decoration-border underline-offset-2 transition-colors hover:decoration-ink"
          >
            {site.email}
          </a>
          . We will respond as soon as we reasonably can.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          This website uses only cookies or similar storage that are needed for
          the site to work. We do not use advertising cookies.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          FarmIT is intended for farmers and farm businesses. Do not join the
          waiting list on behalf of a child under 16.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update this policy as FarmIT grows. The “Last updated” date at
          the top will change when we do. Continued use of the site after an
          update means you accept the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about privacy:{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-ink underline decoration-border underline-offset-2 transition-colors hover:decoration-ink"
          >
            {site.email}
          </a>
          . See also our{" "}
          <Link
            href={site.termsPath}
            className="text-ink underline decoration-border underline-offset-2 transition-colors hover:decoration-ink"
          >
            Terms of Use
          </Link>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
