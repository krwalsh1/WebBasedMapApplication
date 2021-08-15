package com.tco.misc;

import com.tco.misc.DatabaseQuerier;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestDatabaseQuerier {
    private DatabaseQuerier querier;

    @BeforeEach
    public void createTestingConfig() {
        querier = new DatabaseQuerier();
    }

    @Test
    @DisplayName("Database query is valid")
    public void testCountryCount() {
        try {
            ResultSet queries = querier.query("SELECT COUNT(DISTINCT(name)) FROM country");
            queries.next();
            assertEquals(247, queries.getInt("COUNT(DISTINCT(name))"));
        }
        catch(Exception e) {

        }
    }

    @Test
    @DisplayName("Database query is \"Andorra\"")
    public void testCountries() {
        try {
            ResultSet queries = querier.query("SELECT DISTINCT(name) FROM country");
            queries.next();
            assertEquals("Andorra", queries.getString("name"));
        }
        catch(Exception e) {

        }
    }
}
