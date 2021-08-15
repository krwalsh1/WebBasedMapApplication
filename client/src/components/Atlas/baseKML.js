export function baseKML() {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\" xmlns:kml=\"http://www.opengis.net/kml/2.2\" xmlns:atom=\"http://www.w3.org/2005/Atom\">\n" +
        "  <Document>\n" +
        "    <name>Trip</name>\n" +
        "    <open>1</open>\n" +
        "    <description>Trip</description>\n" +
        "    <Style id=\"CrossStyle\">\n" +
        "      <LineStyle>\n" +
        "        <color>000000</color>\n" +
        "        <width>2</width>\n" +
        "      </LineStyle>\n" +
        "    </Style>";
}