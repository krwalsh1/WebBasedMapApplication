package com.tco.misc;
import java.util.*;
import java.lang.*;
import org.json.*;

public class QueryBuilder {

    public static String match;
    public static Integer limit;
    private Map narrow;
    public static String QUERY;
    public static String countQUERY;
    public static String airportString;
    public static String airportType1;
    public static String airportType2;
    public static String airportType3;
    public static String countryFilter;

    public QueryBuilder(String match, Integer limit, Map narrow){
        this.match = match;
        this.limit = limit;
        this.narrow = narrow;
    }

    public void checkNarrow() {
        // Check to make sure narrow{ "type":[] } isnt empty or not specified
        if (narrow.toString().contains("type")) {
            if (!narrow.get("type").toString().contains("airport") && !narrow.get("type").toString().contains("heliport") && !narrow.get("type").toString().contains("balloonport")) {
                this.airportString = null;
            } else {
                if (narrow.get("type") != null && narrow.get("type").toString() != "[]") {
                    this.airportString = narrow.get("type").toString().replaceAll("\\[", "").replaceAll("\\]", "");
                }
            }
        }
        if (narrow.toString().contains("where")) {
            if (narrow.get("where").toString() == "" || narrow.get("where").toString() == "[_]") {
                this.countryFilter = null;
            } else {
                this.countryFilter = narrow.get("where").toString();
                if (narrow.get("where") != null) {
                    this.countryFilter = narrow.get("where").toString().replaceAll("\\[", "").replaceAll("\\]", "");
                }
            }
        }
        buildAirportList();
    }

    private void buildAirportList() {
        if (airportString != null) {
            if (airportString.length() - airportString.replace(",", "").length() == 0) {           //If One airport type is supplied
                airportType1 = airportString;
            }
            if (airportString.length() - airportString.replace(",", "").length() == 1) {           //If Two airport types are supplied
                airportType1 = airportString.substring(0, airportString.indexOf(","));
                airportType2 = airportString.substring(airportString.indexOf(",") + 2, airportString.length());
            }
            if (airportString.length() - airportString.replace(",", "").length() == 2) {           //If Three airport types are supplied
                airportType1 = airportString.substring(0, airportString.indexOf(","));
                airportType2 = airportString.substring(airportString.indexOf(",") + 2, airportString.lastIndexOf(","));
                airportType3 = airportString.substring(airportString.lastIndexOf(",") + 2, airportString.length());
            }
        }
    }

    public void constructQuery(){
        if (narrow != null) {
            checkNarrow();
        }
        String limitKeyword = "";
        if (this.limit == null && this.match != "" && this.match != null) {
            limitKeyword = " LIMIT 1;";
            if (!this.match.isEmpty())
            limitKeyword = " LIMIT 100;";
        }
        if (this.match == null || this.match == "") {
            limitKeyword = ";";
            if (this.limit != null && this.limit != 0){
                limitKeyword = " LIMIT " + this.limit + ";";
            }
            if (this.limit == null && this.match == "") {
                limitKeyword = " LIMIT 1;";
            }
        }
        if (this.limit != null && this.match != null) {
            limitKeyword = " LIMIT " + this.limit + ";";
            if (this.limit == 0) {
                limitKeyword = ";"; //There is no limit if zero is specified
            }
        }
        finalizeQuery(this.match, limitKeyword);
    }

    public void addToBothQueries(String addedString){
        this.QUERY += addedString;
        this.countQUERY += addedString;
        return;
    }

    public void finalizeQuery(String keyword, String limitKeyword) {
        keyword = keyword == null ? "" : keyword; //If keyword is null, set it to empty string to prevent derefencing null pointer
        initializeQuery(keyword);
        if (this.countryFilter != null) {
            addToBothQueries("AND country.name LIKE '%" + countryFilter + "%' ");
        }
        checkForAirports();
        // 3 corner case if/else statements below
        if (keyword == "" || keyword.isEmpty()) { // If the match string is empty (aka Feeling Lucky) return a random place
            this.QUERY += "ORDER BY RAND() " + limitKeyword;
        }
        else { // else return by the order of continent, country, municipality, and airport name
            this.QUERY += "ORDER BY continent.name, country.name, region.name, world.municipality, world.name DESC" + limitKeyword;
        }
        if (this.match == "" && this.limit == null) { // If the match string is empty and limit is null return 1 result (feeling lucky)
            this.countQUERY = "SELECT COUNT(*) from world where world.name like '%Denver International%';";
        }
        this.narrow = null;
        this.airportType1 = null;
        this.airportType2 = null; // Sometimes this file stays open and the airport types and country filters from previous queries will still remain here so I manually null them after every time its ran.
        this.airportType3 = null;
        this.countryFilter = null;
    }

    private void initializeQuery(String keyword) {
        String query = "FROM continent INNER JOIN country ON continent.id = country.continent " +
                "INNER JOIN region ON country.id = region.iso_country INNER JOIN world ON region.id = world.iso_region "
                + "WHERE (country.name LIKE '%" + keyword + "%' OR region.name LIKE '%" + keyword + "%' OR world.name LIKE '%"
                + keyword + "%' OR world.id LIKE '%" + keyword + "%' OR world.municipality LIKE '%" + keyword + "%') ";
        this.QUERY = "SELECT * " + query;
        this.countQUERY = "SELECT COUNT(*) " + query;
        return;
    }

    private void checkForAirports() {
        if (this.airportType1 != null) { //Check for one, two, or three airport type filter options
            addToBothQueries("AND (world.type LIKE '%" + airportType1 + "%' ");
            if (this.airportType2 != null) {
                addToBothQueries("OR world.type LIKE '%" + airportType2 + "%' ");
                if (this.airportType3 != null) {
                    addToBothQueries("OR world.type LIKE '%" + airportType3 + "%' ");
                }
            }
            this.QUERY += ")";
            this.countQUERY += ");";
        }
        return;
    }
}
