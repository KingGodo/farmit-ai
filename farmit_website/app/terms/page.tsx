import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout, { LegalSection } from "@/components/landing/LegalLayout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Terms of Use — ${site.name}`,
  description:
    "Terms for using the FarmIT AI website and joining the waiting list.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Use" updated="26 August 2026">
      <LegalSection title="Agreement">
        <p>
          These terms govern this website and the FarmIT waiting list. By using
          the site or submitting the waiting-list form, you agree to them. If
          you do not agree, do not use the site.
        </p>
        <p>
          FarmIT is a production service. Joining the waiting list does not
          create a paid contract or guarantee a specific start date.
        </p>
      </LegalSection>

      <LegalSection title="The service">
        <p>
          FarmIT helps Zimbabwean farmers diagnose crop problems from a leaf
          photo and get practical treatment guidance on WhatsApp.
        </p>
        <p>
          Information on this website is for general explanation. It is not a
          substitute for an agronomist, extension officer, or registered
          pesticide advice. Always follow Zimbabwean law and product labels
          when using chemicals.
        </p>
      </LegalSection>

      <LegalSection title="Waiting list">
        <p>
          The waiting list is on this website only. It is not a WhatsApp
          signup. You must give accurate details. We may refuse or remove an
          entry that looks false, duplicate, or submitted on behalf of someone
          else without permission.
        </p>
        <p>
          We will use your details as described in our{" "}
          <Link
            href={site.privacyPath}
            className="text-ink underline decoration-border underline-offset-2 transition-colors hover:decoration-ink"
          >
            Privacy Policy
          </Link>
          . We may contact you by phone or email to complete registration. We
          do not promise that every person on the list will get access on the
          same day.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Misuse the site, attempt to break it, or overload it</li>
          <li>Submit other people’s information without their consent</li>
          <li>Use FarmIT content as if it were certified agronomic advice</li>
          <li>Copy the site or FarmIT branding for a competing service</li>
        </ul>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          The FarmIT name, logo, website, and content belong to FarmIT AI. You
          may not copy or reuse them except as allowed by law (for example
          fair quotation).
        </p>
      </LegalSection>

      <LegalSection title="No warranties">
        <p>
          The site, waiting list, and WhatsApp service are provided “as is”. We
          do not warrant that they will always be available, error-free, or
          that crop advice will be complete or suitable for every farm.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent allowed by Zimbabwean law, FarmIT AI is not
          liable for crop loss, missed treatment, or other damages arising from
          use of this website or from waiting-list communications. Nothing in
          these terms limits liability that cannot be limited by law.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may change these terms as FarmIT develops. The “Last updated”
          date will change when we do. If you continue to use the site after a
          change, the new terms apply.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These terms are governed by the laws of Zimbabwe. Disputes will be
          handled in the courts of Zimbabwe, unless the law requires otherwise.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions:{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-ink underline decoration-border underline-offset-2 transition-colors hover:decoration-ink"
          >
            {site.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
