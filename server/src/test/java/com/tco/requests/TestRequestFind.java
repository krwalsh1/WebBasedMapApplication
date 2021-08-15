package com.tco.requests;

import com.tco.requests.RequestDistance;
import java.util.*;
import org.json.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestRequestFind {

    @Test
    @DisplayName("Request type is \"find\"")
    public void testColoradoDIA() {
        RequestFind find = new RequestFind("Denver International", 1);
        find.buildResponse();
        assertEquals(1, find.getNumResults()); // There is only one Denver International Airport
    }

    @Test
    @DisplayName("Request type is \"find\"")
    public void testAtlantaResults() {
        RequestFind find = new RequestFind("atlanta", 50);
        find.buildResponse();
        assertEquals(36, find.getNumResults()); // There are 36 airports that contain 'atlanta' as one of their characteristics
    }

    @Test
    @DisplayName("Request type is \"find\"")
    public void testFortCollinsResults() {
        RequestFind find = new RequestFind("fort collins", 50);
        find.buildResponse();
        assertEquals(13, find.getNumResults()); // There are 13 'Fort Collins', 11 in the municipality and two with fort collins in the name
    }

    @Test
    @DisplayName("Request type is \"find\"")
    public void testMiami() {
        RequestFind find = new RequestFind("Miami", 80);
        find.buildResponse();
        assertEquals(39, find.getNumResults()); // There are 39 airports containing 'Miami'
    }

    @Test
    @DisplayName("Request type is \"find\"")
    public void testQueens() {
        RequestFind find = new RequestFind("Queens", 100);
        find.buildResponse();
        assertEquals(522, find.getNumResults()); // There are 522 airports containing 'Queens'
    }

    @Test
    @DisplayName("Request type is \"find\"")
    public void testNebraska() {
        RequestFind find = new RequestFind("Nebraska", 30);
        find.buildResponse();
        assertEquals(296, find.getNumResults()); // There are 296 airports containing 'Nebraska'
    }

    @Test
    @DisplayName("Request type is \"find\"")
    public void testCharleston() {
        RequestFind find = new RequestFind("Charleston", 50);
        find.buildResponse();
        assertEquals(20, find.getNumResults()); // There are 20 airports containing 'Charleston'
    }

    @Test
    @DisplayName("Request type is \"find\"")
    public void testColumbus() {
        RequestFind find = new RequestFind("Columbus", 80);
        find.buildResponse();
        assertEquals(55, find.getNumResults()); // There are 55 airports containing 'Columbus'
    }

    @Test
    @DisplayName("Request type is \"find\"")
    public void testAstoria() {
        RequestFind find = new RequestFind("Astoria", 80);
        find.buildResponse();
        assertEquals(7, find.getNumResults()); // There are 55 airports containing 'Columbus'
    }

    @Test
    @DisplayName("Request type is \"find\"")
    public void testMexico() {
        RequestFind find = new RequestFind("Mexico", 80);
        find.buildResponse();
        assertEquals(748, find.getNumResults()); // There are 748 airports containing 'Columbus'
    }

    // TESTING NARROW{}

    @Test
    @DisplayName("Request type is \"find\"")
    public void testUSFiltered() {
        JSONObject narrowObj = new JSONObject("{\"where\": [\"United States\"], \"type\": [\"balloonport\"]}");
        Map<String, Object> narrowParams = narrowObj.toMap();
        RequestFind find = new RequestFind("_", 0, narrowParams);
        find.buildResponse();
        find.clearNarrow();
        assertEquals(17, find.getNumResults()); // There are 17 balloonports in the United States
    }

    @Test
    @DisplayName("Request type is \"find\"")
    public void testBulgariaFiltered() {
        JSONObject narrowObj = new JSONObject("{\"where\": [\"Bulgaria\"], \"type\": [\"balloonport\", \"heliport\"]}");
        Map<String, Object> narrowParams = narrowObj.toMap();
        RequestFind find = new RequestFind("_", 0, narrowParams);
        find.buildResponse();
        find.clearNarrow();
        assertEquals(1, find.getNumResults()); // There is one heliport in Bulgaria, no balloonports
    }

    @Test
    @DisplayName("Request type is \"find\"")
    public void testSierraLeoneAllTypes() {
        JSONObject narrowObj = new JSONObject("{\"where\": [\"Sierra Leone\"], \"type\": [\"balloonport\", \"heliport\", \"airport\"]}");
        Map<String, Object> narrowParams = narrowObj.toMap();
        RequestFind find = new RequestFind("_", 0, narrowParams);
        find.buildResponse();
        find.clearNarrow();
        assertEquals(12, find.getNumResults()); // There is one heliport in Bulgaria, no balloonports
    }

    // Tests for Corner Cases //

    // limit is null but match is not
    @Test
    @DisplayName("Request type is \"find\"")
    public void testLimitNullMatchValid() {
        RequestFind find = new RequestFind("hey");
        find.buildResponse();
        find.clearNarrow();
        assertEquals(43, find.getNumResults()); // There are 43 (random) airports in the world containing "hey"
    }

    // match is null and limit is null -> should have found:100
    @Test
    @DisplayName("Request type is \"find\"")
    public void testBothNull() {
        RequestFind find = new RequestFind();
        find.buildResponse();
        find.clearNarrow();
        assertEquals(50427, find.getNumResults()); // Should be 100 (internal server limit) random places
    }

    // match is null and limit is not null -> feeling lucky with limit number for found
    @Test
    @DisplayName("Request type is \"find\"")
    public void testMatchNull() {
        RequestFind find = new RequestFind(15);
        find.buildResponse();
        find.clearNarrow();
        assertEquals(15, find.getNumResults()); // Should be 15 random results
    }

    // match is empty string and limit may or may not be specified -> this is feeling lucky
    @Test
    @DisplayName("Request type is \"find\"")
    public void testFeelingLucky() {
        RequestFind find = new RequestFind("");
        find.buildResponse();
        find.clearNarrow();
        assertEquals(1, find.getNumResults()); // There is one heliport in Bulgaria, no balloonports
    }

    // match is empty string and limit is zero -> this should return the entire database
    @Test
    @DisplayName("Request type is \"find\"")
    public void testGiveMeEverything() {
        RequestFind find = new RequestFind("", 0);
        find.buildResponse();
        find.clearNarrow();
        assertEquals(50427, find.getNumResults()); // There is one heliport in Bulgaria, no balloonports
    }

}