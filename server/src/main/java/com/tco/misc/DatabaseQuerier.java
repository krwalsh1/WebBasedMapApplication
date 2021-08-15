package com.tco.misc;

import com.tco.misc.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;

public class DatabaseQuerier {
    private final transient Logger log = LoggerFactory.getLogger(DatabaseQuerier.class);

    private static final String ISTRAVIS = System.getenv("TRAVIS");
    private static final String USETUNNEL = System.getenv("CS314_USE_DATABASE_TUNNEL");
    private static String db_user = "cs314-db";
    private static String db_password = "eiK5liet1uej";
    private static String db_url = "jdbc:mariadb://127.0.0.1:56247/cs314";

    public ResultSet query(String dbQuery) {
        if (USETUNNEL != null && USETUNNEL.equals("true")) {
            db_url = "jdbc:mariadb://127.0.0.1:56247/cs314";
        }
        else {
            db_url = "jdbc:mariadb://faure.cs.colostate.edu/cs314";
        }

        // If travis is running set the database connection to a local database using the world.sql file under server/src/test/resources
        if  (ISTRAVIS != null && ISTRAVIS.equals("true")) {
            db_url = "jdbc:mariadb://127.0.0.1/cs314";
            db_user = "root";
            db_password = null;
        }

        try (
            // connect to the database and query
            Connection conn = DriverManager.getConnection(db_url, db_user, db_password);
            Statement query = conn.createStatement();
        ) {
            ResultSet results = query.executeQuery(dbQuery);
            conn.close();
            return results;
        } catch (Exception e) {
            log.error("Exception: LOOK HERE--->" + e.getMessage());
            return null;
        }
    }
}
