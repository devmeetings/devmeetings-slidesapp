package me.todr.slider.runner;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.InvocationTargetException;

import me.todr.slider.runner.JavaRunner;

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
		StringBuilder stringBuilder = new StringBuilder();
		StringBuilder code = stringBuilder;
		code.append("public class TestClass {\n");
		code.append("public static int main() {\n");
		code.append("System.out.println(\"xyz\");");
		code.append("return 5;");
		code.append("}\n");
		code.append("}");

		// when
		CompilerOutput clazz = cut.compile("TestClass", code.toString());

		// then
		assertThat(clazz).isNotNull();
		assertThat(clazz.getClazz()).isNotNull();
		assertThat(clazz.getClazz().getMethod("main").invoke(null))
				.isEqualTo(5);
	}
}
