package me.todr.slider.runner;

import java.io.IOException;
import java.security.SecureClassLoader;
import java.util.Map;

import javax.tools.FileObject;
import javax.tools.ForwardingJavaFileManager;
import javax.tools.JavaFileObject;
import javax.tools.JavaFileObject.Kind;
import javax.tools.StandardJavaFileManager;

import com.google.common.collect.Maps;

class ClassFileManager extends
		ForwardingJavaFileManager<StandardJavaFileManager> {
	/**
	 * Instance of JavaClassObject that will store the compiled bytecode of our
	 * class
	 */
	private final Map<String, JavaClassObject> jclassObjects;

	/**
	 * Will initialize the manager with the specified standard java file manager
	 *
	 * @param standardManger
	 */
	public ClassFileManager(StandardJavaFileManager standardManager) {
		super(standardManager);
		jclassObjects = Maps.newHashMap();
	}

	/**
	 * Will be used by us to get the class loader for our compiled class. It
	 * creates an anonymous class extending the SecureClassLoader which uses the
	 * byte code created by the compiler and stored in the JavaClassObject, and
	 * returns the Class for it
	 */
	@Override
	public ClassLoader getClassLoader(Location location) {
		return new SecureClassLoader() {
			@Override
			protected Class<?> findClass(String name)
					throws ClassNotFoundException {

				byte[] b = jclassObjects.get(name).getBytes();
				return super.defineClass(name, b, 0, b.length);
			}
		};
	}

	public boolean hasClass() {
		return !jclassObjects.isEmpty();
	}

	/**
	 * Gives the compiler an instance of the JavaClassObject so that the
	 * compiler can write the byte code into it.
	 */
	@Override
	public JavaFileObject getJavaFileForOutput(Location location,
			String className, Kind kind, FileObject sibling) throws IOException {
		JavaClassObject jclassObject = new JavaClassObject(className, kind);
		jclassObjects.put(className, jclassObject);
		return jclassObject;
	}
}