package me.todr.slider.runner;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.InvocationTargetException;

import me.todr.slider.runner.CompilerOutput;
import me.todr.slider.runner.JavaRunner;
import me.todr.slider.runner.JavaRunnerException;

import org.junit.Before;
import org.junit.Test;

public class JavaRunnerTest {

	private JavaRunner cut;

	@Before
	public void setUp() {
		cut = new JavaRunner();
	}

	@Test
	public void shouldCompileClassGivenAsString()
			throws IllegalAccessException, IllegalArgumentException,
			InvocationTargetException, NoSuchMethodException, SecurityException {
		// given
		String string = getTestClass();

		// when
		CompilerOutput clazz = cut.compile("TestClass", string);

		// then
		assertThat(clazz).isNotNull();
		assertThat(clazz.getClazz()).isNotNull();
	}

	@Test
	public void shouldRunCompiledClass() throws JavaRunnerException {
		// given
		String string = getTestClass();
		CompilerOutput clazz = cut.compile("TestClass", string);

		// when
		String output = cut.run(clazz);

		// then
		assertThat(output).isEqualTo("xyz\n");
	}

	private String getTestClass() {
		StringBuilder stringBuilder = new StringBuilder();
		StringBuilder code = stringBuilder;
		code.append("public class TestClass {\n");
		code.append("public static void main() {\n");
		code.append("System.out.println(\"xyz\");");
		code.append("}\n");
		code.append("}");
		String string = code.toString();
		return string;
	}

}
