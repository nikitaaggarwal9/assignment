import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

// fetched data using axios
(async () => {
  const {
    data: {
      response: { venues },
    },
  } = await axios.get(
    "https://api.foursquare.com/v2/venues/search?oauth_token=SQ1PQIHAYYDTHK0VJAYUTWM1CJN0XDILXSJG5KOPI045MC1T&v=20220331&near=Bangalore&limit=50"
  );

  // made it console interactive using inquirer and chalk library
  // we get three values from console: name, verifiedValue and sortBy
  const { name, varifiedValue, sortBy } = await inquirer.prompt([
    {
      type: "message",
      name: "message",
      message: chalk.yellow.bold(
        `${chalk.yellow("Find Desired Venues Details")} - ${chalk.red(
          "Press 'Enter' To Select Filter Values"
        )}`
      ),
    },
    {
      type: "input",
      name: "name",
      message: chalk.yellow.bold(
        `${chalk.yellow("Enter Name to filter")} - ${chalk.red(
          "Or skip by pressing Enter"
        )}`
      ),
    },
    {
      type: "input",
      name: "varifiedValue",
      message: chalk.yellow.bold(
        `${chalk.yellow(
          "Enter true/false to filter on the basis of Verified"
        )} - ${chalk.red("Or skip by pressing Enter")}`
      ),
    },
    {
      type: "input",
      name: "sortBy",
      message: chalk.yellow.bold(
        `${chalk.yellow(
          "Select an option number for Sorting on the basis of: "
        )} - ${chalk.red("1. Tip Count 2. Users Count 3. Checkins Count ")}`
      ),
    },
  ]);

  // this function filters and sorts the data according to the input received and print it in desired format
  // we pass the three values to this function to get the result
  desiredVenues({ name, varifiedValue, sortBy, venues });
})();

function desiredVenues({ name, varifiedValue, sortBy, venues }) {
  // if none of the filter function works we want all the venues in output
  let filterData = venues;

  // if name has some value than filter on the basis of name else all the venues are part of result
  filterData = venues.filter(({ name: venueName }) =>
  name ? venueName.includes(name) : true
  );
  

  // if verifiedValue has some value than filter on the basis of verifiedValue else all the venues are part of result
  filterData = filterData.filter(({ verified }) => {
    varifiedValue ? String(verified) == varifiedValue.toLowerCase() : true;
  });


  // after sorting we move to sorting, we expect only 3 values in sortBy (1, 2, 3) apart from that sort doesn't work
  // 1 for tipCount, 2 for usersCount, 3 for checkinsCount
  filterData.sort((venue, venueV2) => {
    return (
      venue.stats[Object.keys(venue.stats)[sortBy - 1]] -
      venueV2.stats[Object.keys(venueV2.stats)[sortBy - 1]]
    );
  });


  // finally we print the desired fields of filterData 
  filterData.forEach(({ name, categories, verified, stats }) => {
    console.log("{");
    console.log(" name: ", name);
    categories.length == 1
      ? console.log(
          " categories: ",
          categories[0]["name"],
          ",",
          categories[0]["pluralName"],
          ",",
          categories[0]["shortName"]
        )
      : console.log(" categories: ");
    console.log(" verified:", verified);
    console.log(" stats:", stats);
    console.log("}");
  });
}
