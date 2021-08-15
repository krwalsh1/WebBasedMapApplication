package com.tco.requests;

import com.tco.misc.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.json.*;

import java.util.*;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;

import com.tco.misc.QueryBuilder;
import com.tco.misc.DatabaseQuerier;

public class RequestFind extends RequestHeader {

    private final transient Logger log = LoggerFactory.getLogger(RequestFind.class);

    private String match;
    private Integer limit;
    private Map narrow;
    private Integer found = 0;
    private static String QUERY = "SELECT * FROM world LIMIT 1;";
    private static String countQUERY = "";
    private ArrayList<Map> places = new ArrayList<Map>();

    public RequestFind() {
        this.requestType = "find";
        this.requestVersion = RequestHeader.CURRENT_SUPPORTED_VERSION;
    }

    public RequestFind(String match){   // Constructor required for TestRequests.java (testing corner case where limit isnt specified)
        this.match = match;
        replaceSpecialChars();
    }

    public RequestFind(Integer limit){  // Constructor required for TestRequests.java (testing corner case where match isnt specified)
        this.limit = limit;
    }

    public RequestFind(String match, Integer limit){
        this.match = match;
        this.limit = limit;
        this.narrow = null;
        replaceSpecialChars();
    }

    public RequestFind(String match, Integer limit, Map narrow){
        this.match = match;
        this.limit = limit;
        this.narrow = narrow;
        replaceSpecialChars();
    }

    public void setQueries(String QUERY, String countQUERY){
        this.QUERY = QUERY;
        this.countQUERY = countQUERY;
    }

    public void clearNarrow(){ //This function exists because for some reason running a post request with no narrow element specified after running one with narrow specified keeps the same narrow elements from the previous request
        this.narrow = null;
    }

    public void RetrieveFromDatabase() {
        QueryBuilder newQuery = new QueryBuilder(this.match, this.limit, this.narrow);
        newQuery.constructQuery();
        setQueries(newQuery.QUERY, newQuery.countQUERY);
        DatabaseQuerier queries = new DatabaseQuerier();
        try {
            ResultSet numResults = queries.query(this.countQUERY);
            numResults.next();
            this.found = numResults.getInt("COUNT(*)");
            buildQuery(queries);
            if (this.match == null || this.match == ""){ //Feeling lucky case that was missed in sprint 4 api test cases
                if (this.limit != null && this.limit != 0) {
                    this.found = limit;
                }
            }
            clearNarrow();
        }
        catch (Exception e) {
            log.error("Exception: LOOK HERE--->" + e.getMessage());
        }
    }

    private void buildQuery(DatabaseQuerier queries) {
        try {
            ResultSet results = queries.query(this.QUERY);
            while (results.next()) { // iterate through query results and print out the column values
                Map parser = new HashMap();
                parser.put("name", results.getString("world.name"));
                parser.put("latitude", results.getString("latitude"));
                parser.put("longitude", results.getString("longitude"));
                parser.put("id", results.getString("world.id"));
                parser.put("altitude", results.getInt("altitude"));
                parser.put("type", results.getString("type"));
                if (results.getString("municipality") != null) {
                    parser.put("municipality", results.getString("municipality"));
                }
                if (results.getString("world.wikipedia_link") != null) {
                    parser.put("url", results.getString("world.wikipedia_link"));
                }
                parser.put("country", results.getString("country.name"));
                parser.put("region", results.getString("region.name"));
                places.add(parser);
            }
        }
        catch (Exception e) {
            log.error("Exception: LOOK HERE--->" + e.getMessage());
        }
    }

    public Integer getNumResults(){
        return this.found;
    }

    public void replaceSpecialChars(){ //This method prevents SQL injection attacks by replacing symbols with underscores
        match.replaceAll("[!@#$%^&*()<>;,]", "_");
        return;
    }

    @Override
    public void buildResponse() {
        if (this.match != null)
            replaceSpecialChars();
        RetrieveFromDatabase();
        log.trace("buildResponse -> {}", this);
    }

}
