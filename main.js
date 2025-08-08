// =================================================================================
// === 1. CONFIGURATION ============================================================
// =================================================================================

// Define the Area of Interest (AOI) and name it as "table"

// Define the year and the seasonal periods you want to analyze
// Add or remove seasons as needed
var year = '2019';
var seasons = [
  {name: 'Winter', start: year + '-12-01', end: year + '-03-01', year_offset: -1},
  {name: 'Spring', start: year + '-03-01', end: year + '-06-01', year_offset: 0},
  {name: 'Summer', start: year + '-06-01', end: year + '-09-01', year_offset: 0},
];

// =================================================================================
// === 2. HELPER FUNCTIONS =========================================================
// =================================================================================

// a function to mask clouds and cloud shadows in a Landsat 8 SR image.
function mask_landsat_clouds(image) {
  var qa = image.select('QA_PIXEL');
  var cloud_shadow_bit = (1 << 4);
  var cloud_bit = (1 << 3);
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloud_shadow_bit).eq(0)
      .and(qa.bitwiseAnd(cloud_bit).eq(0));
  return image.updateMask(mask);
}

// a function to Calculates NDVI for a cloud-masked Landsat 8 image.
function calculate_ndvi(image) {
  return image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI').copyProperties(image,['system:time_start']);
}


// =================================================================================
// === 3. MAIN WORKFLOW ============================================================
// =================================================================================

// Create a function that generates a seasonal NDVI Maximum Value Composite (MVC)
function create_seasonal_mvc(season) {
  // Adjust dates for seasons that span across years (like winter)
  var start_date = ee.Date(season.start).advance(season.year_offset, 'year');
  var end_date = ee.Date(season.end);

  // Filter the main collection for the season
  var seasonal_collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
      .filterBounds(table)
      .filterDate(start_date, end_date)
      .map(mask_landsat_clouds)
      .map(calculate_ndvi);

  // Create the MVC and rename the band with the season's name
  return seasonal_collection.max()
      .rename(ee.String(season.name).cat('_NDVI_max'));
}

// Map over the list of seasons to create an MVC for each one
var seasonal_mvcs = seasons.map(create_seasonal_mvc);

// Stack the seasonal MVC images into a single multi-band image
var stacked_mvc = ee.ImageCollection.fromImages(seasonal_mvcs).toBands();

// Clip the final stacked image once at the end for efficiency
var final_image = stacked_mvc.clip(table);

print('Final Multi-Season NDVI Image:', final_image);


// =================================================================================
// === 4. VISUALIZATION ============================================================
// =================================================================================

// Visualization parameters for the final RGB composite
var rgb_vis_params = {
  bands: ['1_Spring_NDVI_max', '2_Summer_NDVI_max', '0_Winter_NDVI_max'],
  min: 0.1,
  max: 0.8,
  gamma: 1.2
};

Map.centerObject(table, 9);

// Add the final RGB composite to the map.
// Colors will represent cropping intensity in different seasons:
// Red = High NDVI in Spring
// Green = High NDVI in Summer
// Blue = High NDVI in Winter
Map.addLayer(final_image, rgb_vis_params, 'Seasonal Cropping Intensity');
