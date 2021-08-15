package com.tco.requests;

import com.tco.requests.RequestTrip;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;
import java.lang.Math;
import java.io.*;
import java.util.Timer;
import java.util.Arrays;
import java.util.concurrent.ThreadLocalRandom;
import com.tco.misc.BadRequestException;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestTripOptimize {

    private final transient Logger log = LoggerFactory.getLogger(RequestConfig.class);
    private long[] expectedDistancesThreeLocationTrip = {62, 44, 5827, 5857};
    ArrayList<Map<String, String>> storedRandomPlacesList;

    private RequestTrip buildThreeLocationTrip(double responseTime) {
        Map<String, String> options;
        ArrayList<Map<String, String>> places = new ArrayList<Map<String, String>>();
        options = new HashMap();
        options.put("title", "My Trip");
        options.put("earthRadius", "3959");
        options.put("units", "miles");
        if(responseTime == 1.0) {
            options.put("response", "1.0");
        }


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

        Map<String, String> add4 = new HashMap<String, String>();
        add4.put("name", "Osaka International Airport");
        add4.put("latitude", "37.785499");
        add4.put("longitude", "135.438003");

        places.add(add1);
        places.add(add3);
        places.add(add2);
        places.add(add4);

        RequestTrip trip = new RequestTrip(options, places);
        trip.buildResponse();
        return trip;
    }

    private RequestTrip buildRandomSizeTrip(double responseTime, boolean useStoredRandomPlacesList, int minTripSize, int maxTripSize) {
        Map<String, String> options;
        ArrayList<Map<String, String>> places = new ArrayList<Map<String, String>>();
        options = new HashMap();
        options.put("title", "My Trip");
        options.put("earthRadius", "3959");
        options.put("units", "miles");
        if (responseTime == 1.0) {
            options.put("response", "1.0");
        }
        else if (responseTime == .99) {
            options.put("response", ".99");
        }
        else if (responseTime == .98) {
            options.put("response", ".98");
        }

        if (useStoredRandomPlacesList) {
            places = storedRandomPlacesList;
        }
        else {
            int tripSize = ThreadLocalRandom.current().nextInt(minTripSize, maxTripSize);
            for (int i = 1; i <= tripSize; i++) {
                double latitude = ThreadLocalRandom.current().nextInt(-9000, 9001) / 100;
                double longitude = ThreadLocalRandom.current().nextInt(-18000, 18001) / 100;
                //log.info("Random latitude: " + latitude);
                //log.info("Random longitude: " + longitude);
                //log.info("i: " + i);
                Map<String, String> location = new HashMap<String, String>();
                location.put("name", "Location " + Integer.toString(i));
                location.put("latitude", Double.toString(latitude));
                location.put("longitude", Double.toString(longitude));
                places.add(location);
            }
        }
        storedRandomPlacesList = places;

        RequestTrip trip = new RequestTrip(options, places);
        trip.buildResponse();
        return trip;
    }


    @Test
    @DisplayName("Testing trip optimization does NOT occur when a response time is NOT provided")
    public void testTripNoOptimization() {
        log.info("Testing trip optimization does NOT occur when a response time is NOT provided:");
        long globalStartTime = System.currentTimeMillis();
        RequestTrip trip;
        trip = buildThreeLocationTrip(0.0);
        log.info("Trip EXPECTED distances: " + Arrays.toString(expectedDistancesThreeLocationTrip));
        log.info("Trip calculated distances: " + Arrays.toString(trip.getDistancesList()));
        long elapsedTime = System.currentTimeMillis() - globalStartTime;
        log.info("Elapsed time for trip optimization: " + elapsedTime + " ms\n");
        assertTrue(Arrays.equals(expectedDistancesThreeLocationTrip, trip.getDistancesList()));
    }


    @Test
    @DisplayName("Testing trip optimization occurs when a response time provided")
    public void testTripOptimization() {
        log.info("Testing trip optimization occurs when a response time provided:");
        long globalStartTime = System.currentTimeMillis();
        RequestTrip trip;
        trip = buildThreeLocationTrip(1.0);
        log.info("Trip distances with NO optimization: " + Arrays.toString(expectedDistancesThreeLocationTrip));
        log.info("Trip distances calculated WITH optimization: " + Arrays.toString(trip.getDistancesList()));
        long elapsedTime = System.currentTimeMillis() - globalStartTime;
        log.info("Elapsed time for trip optimization: " + elapsedTime + " ms\n");
        assertFalse(Arrays.equals(expectedDistancesThreeLocationTrip, trip.getDistancesList()));
    }



    @Test
    @DisplayName("Testing 4 trip optimization")
    public void testNearestNeighorOptimization() {
        log.info("Testing 4 trip optimization");
        long globalStartTime = System.currentTimeMillis();
        RequestTrip trip;
        trip = buildThreeLocationTrip(1.0);

        int cumulativeDistanceNOTOptimized = cumulativeDistanceCalculator(expectedDistancesThreeLocationTrip);
        int cumulativeDistanceOptimized = cumulativeDistanceCalculator(trip.getDistancesList());
        log.info("Cumulative distance EXPECTED with NO optimization: " + cumulativeDistanceNOTOptimized);
        log.info("Cumulative distance with optimization: " + cumulativeDistanceOptimized);

        long elapsedTime = System.currentTimeMillis() - globalStartTime;
        log.info("Elapsed time for trip optimization: " + elapsedTime + " ms\n");

        assertTrue(elapsedTime < 950);
        assertTrue(cumulativeDistanceOptimized < cumulativeDistanceNOTOptimized);
    }



    @Test
    @DisplayName("Testing 10 random trips for proper optimization")
    public void testOneHundredLargeRandomTrips() {
        int minTripSize = 10;
        int maxTripSize = 1500;
        int numberOfTrips = 10;
        log.info("Testing " + numberOfTrips + " random trips ranging from " + minTripSize + " locations to " + maxTripSize);

        for (int i = 0; i < numberOfTrips; i++) {

            RequestTrip tripNotOptimized;
            tripNotOptimized = buildRandomSizeTrip(0, false, minTripSize, maxTripSize);
            long globalStartTime = System.currentTimeMillis();
            RequestTrip tripOptimized;
            tripOptimized = buildRandomSizeTrip(1, true, minTripSize, maxTripSize);
            long elapsedTime = System.currentTimeMillis() - globalStartTime;

            log.info("Number of places on trip: " + storedRandomPlacesList.size());
            int cumulativeDistanceNOTOptimized = cumulativeDistanceCalculator(tripNotOptimized.getDistancesList());
            int cumulativeDistanceOptimized = cumulativeDistanceCalculator(tripOptimized.getDistancesList());
            log.info("Cumulative distance EXPECTED with NO optimization: " + cumulativeDistanceNOTOptimized);
            log.info("Cumulative distance with optimization: " + cumulativeDistanceOptimized);

            log.info("Elapsed time for trip optimization: " + elapsedTime + " ms\n");

            assertTrue(elapsedTime < 950);
        }
    }

    @Test
    @DisplayName("Testing trip optimization TIMEOUT for 5 random trips to verify TIMEOUT behaviour")
    public void testTripTimeoutWithTripsLargerThan1800() {
        int minTripSize = 2000;
        int maxTripSize = 2500;
        int numberOfTrips = 5;
        log.info("Testing trip optimization TIMEOUT for " + numberOfTrips + " random trips ranging from " + minTripSize + " locations to " + maxTripSize);

        for (int i = 0; i < numberOfTrips; i++) {
            RequestTrip tripNotOptimized;
            tripNotOptimized = buildRandomSizeTrip(0, false, minTripSize, maxTripSize);
            long globalStartTime = System.currentTimeMillis();
            RequestTrip tripOptimized;
            tripOptimized = buildRandomSizeTrip(1.0, true, minTripSize, maxTripSize);
            log.info("Number of places on trip: " + storedRandomPlacesList.size());
            int cumulativeDistanceNOTOptimized = cumulativeDistanceCalculator(tripNotOptimized.getDistancesList());
            int cumulativeDistanceOptimized = cumulativeDistanceCalculator(tripOptimized.getDistancesList());
            log.info("Cumulative distance EXPECTED with NO optimization: " + cumulativeDistanceNOTOptimized);
            log.info("Cumulative distance at trip optimization timeout (should equal expected): " + cumulativeDistanceOptimized);

            long elapsedTime = System.currentTimeMillis() - globalStartTime;
            log.info("Elapsed time for trip optimization: " + elapsedTime + " ms\n");

            assertTrue(elapsedTime < 950);
            assertTrue(cumulativeDistanceNOTOptimized == cumulativeDistanceOptimized);
        }
    }


    private int cumulativeDistanceCalculator(long[] distances) {
        int cumulativeDistance = 0;
        for(int i = 0; i < distances.length; i++) {
            cumulativeDistance += distances[i];
        }
        return cumulativeDistance;
    }







    /*
    Function below controls which data collection function should be used.
    It both variables should be set to false unless futher study to the algorithim behavior is required.
    */
    @Test
    public void optimizationDataCollection() {
        boolean runDistanceTest = false;
        boolean runtimeBoundTest = false;
        if (runDistanceTest) {
            testOptimizationComparisonsDistances();
        }
        if (runtimeBoundTest) {
            testOptimizationComparisonsTimeBounds();
        }
        assertTrue(true);
    }

    /*
    The below code is only used for comparing algorithim cumulative distances clamped at a 925ms
    response time. Generates a .csv file in which data can be graphed and analized
    */

    public void testOptimizationComparisonsDistances() {
        int minTripSize = 4;
        int maxTripSize = 1850;
        int numberOfTrips = 500;

        log.info("Comparing cumulative distances of algorithims for " + numberOfTrips + " random trips ranging from "
                + minTripSize + " locations to " + maxTripSize);
        List<List<String>> rows = new ArrayList<List<String>>();

        for (int i = 0; i < numberOfTrips; i++) {
            RequestTrip tripNotOptimized;
            tripNotOptimized = buildRandomSizeTrip(0, false, minTripSize, maxTripSize);

            long nearestNeighborStartTime = System.currentTimeMillis();
            RequestTrip tripNearestNeighbor;
            tripNearestNeighbor = buildRandomSizeTrip(1.0, true, minTripSize, maxTripSize);
            long nearestNeighborElapsedTime = System.currentTimeMillis() - nearestNeighborStartTime;


            long twoOptStartTime = System.currentTimeMillis();
            RequestTrip tripTwoOpt;
            tripTwoOpt = buildRandomSizeTrip(.99, true, minTripSize, maxTripSize);
            long twoOptElapsedTime = System.currentTimeMillis() - twoOptStartTime;

            long bothAlgorithimsStartTime = System.currentTimeMillis();
            RequestTrip bothAlgorithimsTrip;
            bothAlgorithimsTrip = buildRandomSizeTrip(.98, true, minTripSize, maxTripSize);
            long bothAlgorithimsElapsedTime = System.currentTimeMillis() - bothAlgorithimsStartTime;

            int cumulativeDistanceNOTOptimized = cumulativeDistanceCalculator(tripNotOptimized.getDistancesList());
            int cumulativeDistanceNearestNeighbor = cumulativeDistanceCalculator(tripNearestNeighbor.getDistancesList());
            int cumulativeDistanceTwoOpt = cumulativeDistanceCalculator(tripTwoOpt.getDistancesList());
            int cumulativeDistanceBothAlgorithims = cumulativeDistanceCalculator(bothAlgorithimsTrip.getDistancesList());

            List<String> row = new ArrayList<String>();
            row.add(Integer.toString(storedRandomPlacesList.size()));
            row.add(Integer.toString(cumulativeDistanceNOTOptimized));
            row.add(Integer.toString(cumulativeDistanceNearestNeighbor));
            row.add(Integer.toString(cumulativeDistanceTwoOpt));
            row.add(Integer.toString(cumulativeDistanceBothAlgorithims));
            rows.add(row);

            log.info("Trip Number " + i + " of " + numberOfTrips);
            log.info("Number of places on trip: " + storedRandomPlacesList.size());;
            log.info("Cumulative distance EXPECTED with NO optimization: " + cumulativeDistanceNOTOptimized);
            log.info("Cumulative distance nearest neighbor optimization: " + cumulativeDistanceNearestNeighbor);
            log.info("Cumulative distance with 2-opt optimization: " + cumulativeDistanceTwoOpt + "");
            log.info("Cumulative distance with both nearest neighbor and 2-opt optimization: " + cumulativeDistanceBothAlgorithims);

            log.info("Elapsed time for nearest neighbor: " + nearestNeighborElapsedTime + " ms");
            log.info("Elapsed time for 2-Opt: " + twoOptElapsedTime + " ms");
            log.info("Elapsed time for paired nearest neighbor with 2-Opt: " + bothAlgorithimsElapsedTime + " ms\n");

        }
        try {
            File file = new File("./../../Distance Comparison Data.csv");
            if (file.exists()) {
                log.info("Output file already exists");
                file.delete();
            }
            if (file.createNewFile()) {
                log.info("File created successfully");
            }
            FileWriter csvWriter = new FileWriter(file);
            csvWriter.append("Trip Size");
            csvWriter.append(",");
            csvWriter.append("No Optimization");
            csvWriter.append(",");
            csvWriter.append("Nearest Neighbor");
            csvWriter.append(",");
            csvWriter.append("2-Opt");
            csvWriter.append(",");
            csvWriter.append("Nearest Neighbor & 2-Opt");
            csvWriter.append("\n");

            for (List<String> rowData : rows) {
                csvWriter.append(String.join(",", rowData));
                csvWriter.append("\n");
            }
            csvWriter.flush();
            csvWriter.close();
        }
        catch (Exception e) {
            log.info(e.getMessage());
        }
    }

    /*
    The below code is only used for comparing algorithim cumulative distances clamped at a 925ms
    response time. Generates a .csv file in which data can be graphed and analized
    */

    public void testOptimizationComparisonsTimeBounds() {
        int minTripSize = 4;
        int maxTripSize = 1850;
        int numberOfTrips = 500;

        log.info("Comparing time bound of algorithims for " + numberOfTrips + " random trips ranging from "
                + minTripSize + " locations to " + maxTripSize);
        List<List<String>> rows = new ArrayList<List<String>>();

        for (int i = 0; i < numberOfTrips; i++) {
            long noOptimiaztionStartTime = System.currentTimeMillis();
            RequestTrip tripNotOptimized;
            tripNotOptimized = buildRandomSizeTrip(0, false, minTripSize, maxTripSize);
            long noOptimiaztionElapsedTime = System.currentTimeMillis() - noOptimiaztionStartTime;

            long nearestNeighborStartTime = System.currentTimeMillis();
            RequestTrip tripNearestNeighbor;
            tripNearestNeighbor = buildRandomSizeTrip(1.0, true, minTripSize, maxTripSize);
            long nearestNeighborElapsedTime = System.currentTimeMillis() - nearestNeighborStartTime;


            long twoOptStartTime = System.currentTimeMillis();
            RequestTrip tripTwoOpt;
            tripTwoOpt = buildRandomSizeTrip(.99, true, minTripSize, maxTripSize);
            long twoOptElapsedTime = System.currentTimeMillis() - twoOptStartTime;

            long bothAlgorithimsStartTime = System.currentTimeMillis();
            RequestTrip bothAlgorithimsTrip;
            bothAlgorithimsTrip = buildRandomSizeTrip(.98, true, minTripSize, maxTripSize);
            long bothAlgorithimsElapsedTime = System.currentTimeMillis() - bothAlgorithimsStartTime;

            List<String> row = new ArrayList<String>();
            row.add(Integer.toString(storedRandomPlacesList.size()));
            row.add(Long.toString(noOptimiaztionElapsedTime));
            row.add(Long.toString(nearestNeighborElapsedTime));
            row.add(Long.toString(twoOptElapsedTime));
            row.add(Long.toString(bothAlgorithimsElapsedTime));
            rows.add(row);

            log.info("Trip Number " + i + " of " + numberOfTrips);
            log.info("Number of places on trip: " + storedRandomPlacesList.size());
            log.info("Elapsed time for no optimization: " + noOptimiaztionElapsedTime + " ms");
            log.info("Elapsed time for nearest neighbor: " + nearestNeighborElapsedTime + " ms");
            log.info("Elapsed time for 2-Opt: " + twoOptElapsedTime + " ms");
            log.info("Elapsed time for paired nearest neighbor with 2-Opt: " + bothAlgorithimsElapsedTime + " ms\n");

        }
        try {
            File file = new File("./../../Time Comparison Data.csv");
            if (file.exists()) {
                log.info("Output file already exists");
                file.delete();
            }
            if (file.createNewFile()) {
                log.info("File created successfully");
            }
            FileWriter csvWriter = new FileWriter(file);
            csvWriter.append("Trip Size");
            csvWriter.append(",");
            csvWriter.append("No Optimization");
            csvWriter.append(",");
            csvWriter.append("Nearest Neighbor");
            csvWriter.append(",");
            csvWriter.append("2-Opt");
            csvWriter.append(",");
            csvWriter.append("Nearest Neighbor & 2-Opt");
            csvWriter.append("\n");

            for (List<String> rowData : rows) {
                csvWriter.append(String.join(",", rowData));
                csvWriter.append("\n");
            }
            csvWriter.flush();
            csvWriter.close();
        }
        catch (Exception e) {
            log.info(e.getMessage());
        }
    }


}