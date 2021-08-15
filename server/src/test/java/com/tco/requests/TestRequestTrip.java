package com.tco.requests;

import com.tco.requests.RequestTrip;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;
import java.lang.Math;
import com.tco.misc.BadRequestException;
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestRequestTrip {

    @Test
    @DisplayName("Request type is \"trip\"")
    public void testDenverBoulderFOCO() {
        Map<String, String> options;
        ArrayList<Map<String, String>> places = new ArrayList<Map<String, String>>();
        options = new HashMap();
        options.put("title", "My Trip");
        options.put("earthRadius", "3959");
        options.put("units", "miles");
        options.put("response", "0.0");

        Map<String, String> add1 = new HashMap<String, String>();
        add1.put("name", "Denver");
        add1.put("latitude", "39.7");
        add1.put("longitude", "-105.0");

        Map<String, String> add2 = new HashMap<String, String>();
        add2.put("name", "Boulder");
        add2.put("latitude", "40.0");
        add2.put("longitude", "-105.4");

        Map<String, String> add3 = new HashMap<String, String>();
        add3.put("name", "Fort Collins");
        add3.put("latitude", "40.6");
        add3.put("longitude", "-105.1");

        places.add(add1);
        places.add(add2);
        places.add(add3);

        RequestTrip trip = new RequestTrip(options, places);
        trip.buildResponse();

        long[] testDistances = {30, 44, 62};
        assertTrue(Arrays.equals(testDistances, trip.getDistancesList()));
        assertEquals("My Trip", trip.getTripTitle());
        assertEquals("miles", trip.getTripUnits());
        assertEquals(0.0, trip.getResponseTime());
    }

    @Test
    @DisplayName("Request type is \"trip\"")
    public void testDenverSanFranOsaka() {
        Map<String, String> options;
        ArrayList<Map<String, String>> places = new ArrayList<Map<String, String>>();
        options = new HashMap();
        options.put("title", "Denver to Sanfran to Japan and back");
        options.put("earthRadius", "3959");
        options.put("response", "0.0");

        Map<String, String> add1 = new HashMap<String, String>();
        add1.put("name", "Denver");
        add1.put("latitude", "39.861698");
        add1.put("longitude", "-104.672996");

        Map<String, String> add2 = new HashMap<String, String>();
        add2.put("name", "San Fransisco International Airport");
        add2.put("latitude", "37.618999");
        add2.put("longitude", "-122.375");

        Map<String, String> add3 = new HashMap<String, String>();
        add3.put("name", "Osaka International Airport");
        add3.put("latitude", "37.785499");
        add3.put("longitude", "135.438003");

        places.add(add1);
        places.add(add2);
        places.add(add3);

        RequestTrip trip = new RequestTrip(options, places);
        trip.buildResponse();

        long[] testDistances = {965, 5252, 5860};
        assertTrue(Arrays.equals(testDistances, trip.getDistancesList()));
    }
}