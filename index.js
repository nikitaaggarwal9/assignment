import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

(async () => {
  const {
    data: {
      response: { venues },
    },
  } = await axios.get(
    "https://api.foursquare.com/v2/venues/search?oauth_token=SQ1PQIHAYYDTHK0VJAYUTWM1CJN0XDILXSJG5KOPI045MC1T&v=20220331&near=Bangalore&limit=50"
  );

  const { name, varifiedValue, sortBy } = await inquirer.prompt([
    {
      type: "message",
      name: "message",
      message: chalk.yellow.bold(
        `${chalk.yellow("Find Venues Details")} - ${chalk.red(
          "Press 'Enter' To Select Filter Values"
        )}`
      ),
    },
    {
      type: "input",
      name: "name",
      message: chalk.yellow.bold(
        `${chalk.yellow("Please Enter Name For Filter")} - ${chalk.red(
          "SKIP this option by pressing ENTER"
        )}`
      ),
    },
    {
      type: "input",
      name: "varifiedValue",
      message: chalk.yellow.bold(
        `${chalk.yellow(
          "Please Enter True or False Value Varified Value Filter"
        )} - ${chalk.red("SKIP this option by pressing ENTER")}`
      ),
    },
    {
      type: "input",
      name: "sortBy",
      message: chalk.yellow.bold(
        `${chalk.yellow(
          "Please Select Proper Number for Sorting"
        )} - ${chalk.red("1. Tip Count 2. Users Count 3. Checkins Count ")}`
      ),
    },
  ]);

  desiredVenues({ name, varifiedValue, sortBy, venues });
})();

function desiredVenues({ name, varifiedValue, sortBy, venues }) {
  let filterData = venues;

  filterData = venues.filter(({ name: venueName }) =>
    name ? venueName.includes(name) : true
  );

  filterData = filterData.filter(({ verified }) => {
    return varifiedValue
      ? String(verified) == varifiedValue.toLowerCase()
      : true;
  });

  filterData.sort((venue, venueV2) => {
    return (
      venue.stats[Object.keys(venue.stats)[sortBy - 1]] -
      venueV2.stats[Object.keys(venueV2.stats)[sortBy - 1]]
    );
  });

  filterData.forEach(({ name, categories, verified, stats }) => {
    console.log("{")
    console.log(" name: ", name);
    categories.length == 1 ? console.log(" categories: ", categories[0]["name"], "," ,categories[0]["pluralName"], "," ,categories[0]["shortName"]) : console.log(" categories: ");
    console.log(" verified:", verified);
    console.log(" stats:", stats);
    console.log("}")
  });
}
