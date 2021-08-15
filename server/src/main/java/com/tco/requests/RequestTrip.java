package com.tco.requests;

import java.lang.Math;
import com.tco.misc.BadRequestException;
import java.util.*;
import java.util.Timer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.tco.misc.DistanceCalculator;



public class RequestTrip extends RequestHeader {

    private final transient Logger log = LoggerFactory.getLogger(RequestConfig.class);
    private long[] distances = new long[0];
    private Map<String, String> options;
    private List<Map<String, String>> places;

    @Override
    public void buildResponse() {distances = Arrays.copyOf(distances, places.size());
        if (places.size() == 1) {
            distances[0] = 0;
        }
        else if (getResponseTime() == 0.0){
            getDistances();
        }
        else {
            optimizeTrip();
        }

        //log.trace("buildResponse -> {}", this);
    }

    public RequestTrip() {
        this.requestType = "trip";
        this.requestVersion = RequestHeader.CURRENT_SUPPORTED_VERSION;
    }

    public RequestTrip(Map<String, String> options, List<Map<String, String>> places) {
        this();
        this.options = options;
        this.places = places;
    }

    public double getEarthRadius() {
        double earthRadius = Double.parseDouble(options.get("earthRadius"));
        return earthRadius;
    }

    public void getDistances() {
        log.info("Building distance array");
        for(int from = 0, to = 1; from < places.size(); from++) {
            long distBetween = DistanceCalculator.calculator(getEarthRadius(), places.get(from), places.get(to));
            distances[from] = distBetween;
            to++;
            if (to == places.size()){
                to = 0;
            }
        }
    }

    public Long getDistances(int index) {
        return distances[index];
    }

    public long[] getDistancesList() {
        return distances;
    }

    public Double getResponseTime() {
        if(options.get("response") == null) {
            return 0.0;
        }
        return Double.parseDouble(options.get("response"));
    }

    public String getTripTitle() {
        return options.get("title");
    }

    public String getTripUnits() {
        return options.get("units");
    }

    private void optimizeTrip() {
        log.info("Optimizing trip");
        long startTime = System.currentTimeMillis();

        int[] tripTour = buildDefaultTripTour();
        long maxTime;
        maxTime = setMaxTime(tripTour.length);
        //log.info("Building distance matrix");
        long[][] distanceMatrix = fillDistanceMatrix(startTime, maxTime);
        //log.info("Building places visited array");
        boolean[] placesVisited = new boolean[places.size()];

        if (tripTour.length <= 4) {
            if (timeLeftToOptimize(startTime, maxTime)) {
                nearestNeighborOptimization(tripTour, distanceMatrix, placesVisited, startTime, maxTime);
            }
        }
        else if (tripTour.length > 4 && tripTour.length <= 1500) {
            if (timeLeftToOptimize(startTime, maxTime)) {
                twoOptOptimization(tripTour, distanceMatrix, placesVisited, startTime, maxTime);
            }
        }
        else if (tripTour.length > 1500 && tripTour.length <= 1600) {
            if (timeLeftToOptimize(startTime, maxTime)) {
                nearestNeighborOptimization(tripTour, distanceMatrix, placesVisited, startTime, maxTime);
            }
        }
        else if (tripTour.length > 1600) {
            if (timeLeftToOptimize(startTime, maxTime)) {
                twoOptOptimization(tripTour, distanceMatrix, placesVisited, startTime, maxTime);
            }
        }


        /*
        The below code is utilized for data collection and should be commented out
        unless further data collection is reuquired


        if (timeLeftToOptimize(startTime, maxTime) && getResponseTime() == 1.0) {
            nearestNeighborOptimization(tripTour, distanceMatrix, placesVisited, startTime, maxTime);

        }
        if (timeLeftToOptimize(startTime, maxTime) && getResponseTime() == .99) {
            twoOptOptimization(tripTour, distanceMatrix, placesVisited, startTime, maxTime);
        }

        if (timeLeftToOptimize(startTime, maxTime) && getResponseTime() == .98) {
            nearestNeighborOptimization(tripTour, distanceMatrix, placesVisited, startTime, maxTime);
            distanceMatrix = fillDistanceMatrix(startTime, maxTime);
            twoOptOptimization(tripTour, distanceMatrix, placesVisited, startTime, maxTime);
        }
*/
        long elapsedTime = System.currentTimeMillis() - startTime;
        log.info("Optimization completed in " + elapsedTime + "ms");

        getDistances();
        return;
    }

    private int[] buildDefaultTripTour() {
        int[] tripTour = new int[places.size()];
        for (int i = 0; i < tripTour.length; i++) {
            tripTour[i] = i;
        }
        return tripTour;
    }

    private long[][] fillDistanceMatrix(long startTime, long maxTime) {
        long[][] distanceMatrix = new long[places.size()][places.size()];
        for (int i = 0; i < places.size() && timeLeftToOptimize(startTime, maxTime); i++) {
            for (int j = 0; j < places.size() && timeLeftToOptimize(startTime, maxTime); j++) {
                if (j == i) {
                    distanceMatrix[i][j] = 0;
                }
                else if (j - i < 0){
                    distanceMatrix[i][j] = DistanceCalculator.calculator(getEarthRadius(), places.get(i), places.get(j));
                    distanceMatrix[j][i] = distanceMatrix[i][j];
                }
            }
        }
        return distanceMatrix;
    }


    private void nearestNeighborOptimization(int[] tripTour, long[][] distanceMatrix, boolean[] placesVisited, long startTime, long maxTime) {
        log.info("Optimizing trip with nearest neighbor algorithm");
        long legDistance = Integer.MAX_VALUE;
        tripTour[0] = 0;
        for (int i = 0; i < tripTour.length && timeLeftToOptimize(startTime, maxTime); i++) {
            placesVisited[tripTour[i]] = true;
            for (int j = 0; j < tripTour.length && timeLeftToOptimize(startTime, maxTime); j++) {
                if (placesVisited[j] == false) {
                    if (distanceMatrix[tripTour[i]][j] < legDistance) {
                        legDistance = distanceMatrix[tripTour[i]][j];
                        tripTour[i + 1] = j;
                    }
                }
                if (j + 1 == placesVisited.length && i + 1 == placesVisited.length) {
                    rearrangePlacesArray(tripTour);
                };
            }
            legDistance = Integer.MAX_VALUE;
        }
        return;
    }

    private void twoOptOptimization(int[] tripTour, long[][] distanceMatrix, boolean[] placesVisited, long startTime, long maxTime) {
        log.info("Optimizing trip with 2-opt algorithm");
        long deltaDistance;
        boolean routeImproved = true;
        while (routeImproved && timeLeftToOptimize(startTime, maxTime)) {
            routeImproved = false;
            for (int i = 0; i < tripTour.length - 3 && timeLeftToOptimize(startTime, maxTime); i++) {
                for (int k = i + 2; k < tripTour.length - 1 && timeLeftToOptimize(startTime, maxTime); k++) {
                    deltaDistance = distanceMatrix[tripTour[i]][tripTour[k]] + distanceMatrix[tripTour[i + 1]][tripTour[k + 1]]
                            - distanceMatrix[tripTour[i]][tripTour[i + 1]] - distanceMatrix[tripTour[k]][tripTour[k + 1]];
                    if (deltaDistance < 0) {
                        twoOptReverse(tripTour, i + 1, k);
                        routeImproved = true;
                    }
                }
            }
        }
        rearrangePlacesArray(tripTour);
        return;
    }

    private void twoOptReverse(int[] tripTour, int to, int from) {
        int tempPlace;
        while (to < from) {
            tempPlace = tripTour[to];
            tripTour[to] = tripTour[from];
            tripTour[from] = tempPlace;
            to++;
            from--;
        }
    }

    private long setMaxTime(int tripSize) {
        long maxTime;
        if (tripSize <= 1200) {
            maxTime = 925;
        }
        else if (tripSize <= 1500) {
            maxTime = 850;
        }
        else {
            maxTime = 700;
        }
        return maxTime;
    }

    private boolean timeLeftToOptimize(long startTime, long maxTime) {
        if (System.currentTimeMillis() - startTime < maxTime) {
            return true;
        }
        return false;
    }

    private void rearrangePlacesArray(int[] tour) {
        log.info("Rearranging places array");
        List<Map<String, String>> tempPlaces = new ArrayList<Map<String, String>>(places);
        for (int i = 0; i < tour.length; i++) {
            tempPlaces.set(i, places.get(tour[i]));
        }
        places = new ArrayList<Map<String, String>>(tempPlaces);
    }
}