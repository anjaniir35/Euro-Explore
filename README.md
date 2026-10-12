The following **required** functionality is completed:

- [x] **Application features a button that creates a new API fetch request on click and displays at least three attributes and an image obtained from the returned JSON data**
  - The Discover a City button fetches information from the Wikipedia REST API.
  - The app displays the city title, description, summary, and a thumbnail image returned by the API.
  - The same types of attributes are displayed for each successful result.

- [x] **Only one item/data from API call response is viewable at a time and at least one image is displayed per API call**
  - The app displays one discovered city at a time.
  - The city information and image are taken from the same Wikipedia API response.
  - The app skips results that do not include the required information and a thumbnail image.

- [x] **API call response results should appear random to the user**
  - Clicking Discover a City shuffles the eligible city list and requests information for a randomly selected city.
  - The current city list contains 10 European destinations, so repeated results may occur.

- [x] **Clicking on a displayed value for one attribute adds it to a displayed ban list**
  - The country and region values are clickable.
  - Clicking an unbanned country or region adds it to the ban list.
  - Clicking a value in the ban list removes it.

- [x] **Attributes on the ban list prevent further images/API results with that attribute from being displayed**
  - The app filters out cities whose country or region is on the ban list before requesting a new result.
  - The ban list can be updated by removing values.

- [ ] **Recording demonstrates removing a banned attribute**
  - Include a recording showing that clicking an attribute in the ban list removes it.

## Optional Features

The following **optional** features are implemented:

- [x] Multiple types of attributes are clickable and can be added to the ban list (country and region).

- [ ] Users can see a stored history of their previously displayed results from this session.
  - The current history lists previously discovered city names. To fully meet this stretch feature, update the history to display each previous city's image and attributes.

## Additional Features

The following **additional** features are implemented:

- [x] Loading indicator while a city is being fetched.
- [x] Error messages for failed requests or when no eligible city with complete information can be found.
- [x] Responsive layout for smaller screens.
- [x] Consistent teal-and-blue visual theme.

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src="" title="Video Walkthrough" width="800" alt="Video Walkthrough" />

GIF created with **ScreenToGif** for Windows.

## Notes

One challenge was adapting the original city flashcard project into a random discovery app while preserving its European travel theme and existing city image URLs. Another challenge was handling asynchronous API requests and filtering eligible cities based on the user's ban list. Wikipedia responses can vary, so the app checks that the required fields and thumbnail are available before displaying a result.

## License

Copyright 2026 Anjani

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

