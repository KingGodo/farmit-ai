package com.farmitai.farmitai_backend.common.util;

public final class PersonNames {

	private PersonNames() {
	}

	public static String[] split(String fullName) {
		if (fullName == null || fullName.isBlank()) {
			return new String[] {"Unknown", ""};
		}
		String trimmed = fullName.trim();
		int space = trimmed.indexOf(' ');
		if (space < 0) {
			return new String[] {trimmed, ""};
		}
		return new String[] {trimmed.substring(0, space), trimmed.substring(space + 1).trim()};
	}

	public static String display(String firstName, String lastName) {
		String first = firstName == null ? "" : firstName.trim();
		String last = lastName == null ? "" : lastName.trim();
		return (first + " " + last).trim();
	}
}
