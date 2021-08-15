package com.tco.misc;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.lang.Math;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DistanceCalculator {
    private final Logger log = LoggerFactory.getLogger(DistanceCalculator.class);


    public static long calculator(double radius, Map<String, String> place1, Map<String,String> place2) {
        double latOne = Double.parseDouble(place1.get("latitude"));
        double longOne = Double.parseDouble(place1.get("longitude"));
        double latTwo = Double.parseDouble(place2.get("latitude"));
        double longTwo = Double.parseDouble(place2.get("longitude"));

        return calculator(radius, latOne, longOne, latTwo, longTwo);
    }

    public static long calculator(double radius, double latOne, double longOne, double latTwo, double longTwo) {
        latOne = Math.toRadians(latOne);
        longOne = Math.toRadians(longOne);
        latTwo = Math.toRadians(latTwo);
        longTwo = Math.toRadians(longTwo);

        double firstNumerator = Math.pow(Math.cos(latTwo) * Math.sin(Math.abs(longOne - longTwo)), 2);
        double secNumerator = Math.pow(((Math.cos(latOne) * Math.sin(latTwo)) - (Math.sin(latOne) * Math.cos(latTwo) * Math.cos(Math.abs(longOne - longTwo)))), 2);
        double Numerator = Math.sqrt(firstNumerator + secNumerator);
        double firstDenominator = Math.sin(latOne) * Math.sin(latTwo);
        double secDenominator = Math.cos(latOne) * Math.cos(latTwo) * Math.cos(Math.abs(longOne - longTwo));
        double Denominator = firstDenominator + secDenominator;
      
        return Math.round(radius * Math.atan2(Numerator, Denominator));
    }
}