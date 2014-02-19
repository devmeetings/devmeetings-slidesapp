package me.todr.slider.runner;

import java.util.List;

import com.google.common.collect.ImmutableList;

public class CompilerOutput {
	private final Class<?> clazz;
	private final List<String> errors;

	CompilerOutput(Class<?> clazz) {
		this.clazz = clazz;
		this.errors = ImmutableList.of();
	}

	CompilerOutput(List<String> errors) {
		this.clazz = null;
		this.errors = errors;
	}

	public List<String> getErrors() {
		return errors;
	}

	public Class<?> getClazz() {
		return clazz;
	}
}