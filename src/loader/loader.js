/***

@Desc   Loader loads all the apis in the services.json file 
@Author Shivdeep Singh
***/
const services = require("./services.json");
const path = require("path");
const fs = require("fs");

const loader = (app,apiPath) => {
	
	if (!Object.keys(services).length) {
		console.log(`No services found`.red.underline)
		process.exit(0);
	}


	Object.keys(services).forEach((service) =>  {

		const api = path.join(apiPath, services[service]);
		if (!fs.existsSync(api)) {
			 console.error(`Error: Service ${service} does not exists at path ${api}`.red.underline);
			 process.exit(0);
		}

		console.log(`Loading ${service}`.green)
		app.use(`/${service}`, require(api));

	})

	return app;
}

module.exports = loader;

