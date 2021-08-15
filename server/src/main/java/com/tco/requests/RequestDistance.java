package com.tco.requests;

import com.tco.misc.BadRequestException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.tco.misc.DistanceCalculator;

public class RequestDistance extends RequestHeader {

    private long distance = 0;
    private double earthRadius = 0;
    private Map<String, String> place1, place2;

    private final transient Logger log = LoggerFactory.getLogger(RequestConfig.class);

    @Override
    public void buildResponse() {
        this.place1.put("latitude", "" + getPlaceOneLat());
        this.place1.put("longitude", "" + getPlaceOneLong());

        this.place2.put("latitude", "" + getPlaceTwoLat());
        this.place2.put("longitude", "" + getPlaceTwoLong());

        this.earthRadius = getEarthRadius();

        this.distance = getDistance();

        log.trace("buildResponse -> {}", this);
    }

    public RequestDistance() {
        this.requestType = "distance";
        this.requestVersion = RequestHeader.CURRENT_SUPPORTED_VERSION;
    }

    public RequestDistance(double radius, String lat1, String lon1, String lat2, String lon2) {
        this();
        this.earthRadius = radius;

        this.place1 = new HashMap();
        this.place1.put("latitude", lat1);
        this.place1.put("longitude", lon1);

        this.place2 = new HashMap();
        this.place2.put("latitude", lat2);
        this.place2.put("longitude", lon2);
    }

    public double getPlaceOneLat() {
        return Double.parseDouble(this.place1.get("latitude"));
    }

    public double getPlaceOneLong() {
        return Double.parseDouble(this.place1.get("longitude"));
    }

    public double getPlaceTwoLat() {
        return Double.parseDouble(this.place2.get("latitude"));
    }

    public double getPlaceTwoLong() {
        return Double.parseDouble(this.place2.get("longitude"));
    }

    public double getEarthRadius() {
        return earthRadius;
    }

    public long getDistance() {
        return DistanceCalculator.calculator(earthRadius, getPlaceOneLat(), getPlaceOneLong(), getPlaceTwoLat(), getPlaceTwoLong());
    }
}