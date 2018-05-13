import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;

/**
 * Servlet implementation class QueryProcessor
 */
public class QueryProcessor extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public static final String MYSQL_DB_HOST = "app2900.gha.kfplc.com";
	public static final String MYSQL_DB_NAME = "nlp";
	public static final String MYSQL_DB_USERNAME = "root";
	public static final String MYSQL_DB_PASSWORD = "linuxlinux";

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		PrintWriter pw = response.getWriter();
		String SQL = "";
		try {
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn_mysql = DriverManager.getConnection("jdbc:mysql://"
					+ MYSQL_DB_HOST + ":3306/" + MYSQL_DB_NAME
					+ "?zeroDateTimeBehavior=convertToNull", MYSQL_DB_USERNAME,
					MYSQL_DB_PASSWORD);
			String input = request.getParameter("text");
			Statement statement = conn_mysql.createStatement();
			SQL = app2.getSQL(input, conn_mysql);
			if (SQL != null) {
				ResultSet rs = statement.executeQuery(SQL);
				JSONArray json = app2.convert(rs);
				pw.write("{\"Result\":" + json.toString() + ",\"SQL\":\"" + SQL
						+ "\"}");
			}
		} catch (Exception e) {
			e.printStackTrace();
			pw.write("{\"Error\":\"" + e.getMessage() + "\",\"SQL\":\"" + SQL
					+ "\"}");
		}
		pw.close();
	}
}
