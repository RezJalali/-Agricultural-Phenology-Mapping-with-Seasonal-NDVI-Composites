# Agricultural-Phenology-Mapping-with-Seasonal-NDVI-Composites

This Google Earth Engine project provides an efficient and robust workflow to monitor agricultural activity by visualizing the peak vegetation greenness across different seasons. By creating a Maximum Value Composite (MVC) of the Normalized Difference Vegetation Index (NDVI) for distinct periods of the year, this script generates a single, color-rich RGB image that reveals cropping patterns, monitors fallow land, and helps differentiate between single and multi-season cropping systems.

The final output is a powerful visualization where the **red, green, and blue** channels correspond to peak NDVI in **Spring, Summer, and Winter**, respectively, allowing for intuitive, at-a-glance analysis of a region's agricultural calendar.

-----

## Key Features

  * **Time-Series Analysis:** Leverages a full year of Landsat 8 data to capture the dynamic changes in vegetation health (phenology).
  * **Maximum Value Composite (MVC):** Uses the MVC technique to identify the highest NDVI value for each pixel within a given season, effectively highlighting the peak of the growing cycle.
  * **Robust Cloud Masking:** Integrates a cloud and cloud shadow mask using the `QA_PIXEL` band, ensuring that the maximum values are true vegetation signals and not atmospheric contamination.
  * **Intuitive RGB Visualization:** The final stacked image assigns each season's peak NDVI to a color channel, creating a simple yet profound way to interpret complex cropping patterns.
  * **Efficient & Modular Code:** The script is written with reusable functions and a clear configuration section, making it easy to adapt for different years, regions, or seasonal definitions.

-----

## Methodology

The script follows a structured, multi-step process to transform a year's worth of satellite images into a single, insightful map:

1.  **Configuration:** The user defines an Area of Interest (AOI), a target year, and the specific date ranges for the seasons to be analyzed (e.g., Spring, Summer, Winter).
2.  **Helper Functions:** Two core functions are defined:
      * `mask_landsat_clouds`: A function to remove pixels contaminated by clouds and their shadows.
      * `calculate_ndvi`: A function that takes a cloud-free image and computes its NDVI.
3.  **Seasonal MVC Generation:** The script iterates through the defined seasons. For each season, it:
      * Filters the Landsat 8 image collection to the specified date range.
      * Applies the cloud mask and NDVI calculation to every image in the filtered collection.
      * Computes the `.max()` of the resulting NDVI time-series, creating a single-band image representing the peak vegetation greenness for that season.
4.  **Image Stacking & Visualization:** The individual seasonal MVC images are stacked into a single multi-band image. This image is then added to the map and visualized as an RGB composite.

-----

## Interpreting the Output

The power of this script lies in its final visualization. By mapping the seasonal NDVI peaks to RGB channels, you can instantly interpret land use patterns:

  * 🔴 **Red Pixels:** Indicate areas where peak vegetation occurred in **Spring**. These could be spring-harvested crops or grasslands that green up early.
  * 🟢 **Green Pixels:** Represent areas with peak vegetation in **Summer**, typical of many major food crops like corn and soy.
  * 🔵 **Blue Pixels:** Show areas where peak vegetation occurred in **Winter**, often corresponding to winter wheat or other cover crops.
  * **Mixed Colors:**
      * 🟡 **Yellow (Red + Green):** Active in both Spring and Summer (double-cropping).
      * 🟣 **Magenta (Red + Blue):** Active in Spring and Winter.
      * ⚪ **White (Red + Green + Blue):** Areas that maintain high NDVI across all seasons, such as evergreen forests.
  * ⚫ **Black Pixels:** Areas with consistently low NDVI, such as urban areas, water bodies, or bare soil.

-----

## How to Use

This script is designed to be run directly in the [Google Earth Engine Code Editor](https://code.earthengine.google.com/).

1.  **Copy Code:** Copy the entire script into a new file in the GEE Code Editor.
2.  **Define Your AOI:** Replace the placeholder `table` variable by defining your own Area of Interest. You can use the drawing tools to create a polygon, which will be imported as a `geometry` variable.
3.  **Configure Seasons:** Adjust the `year` and `seasons` variables in the **Configuration** section to fit your analysis needs.
4.  **Run Script:** Click the **"Run"** button. The script will execute and add the final `Seasonal Cropping Intensity` layer to your map.

-----

## License

This project is open-source and available under the [MIT License](LICENSE.md).
