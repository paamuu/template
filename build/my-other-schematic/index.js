"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const schematics_1 = require("@angular-devkit/schematics");
// A factory is a RuleFactory. It takes the options that might have been coming from the command
// line or another schematic. These can be defined in a schema.json, which will validate
function default_1(options) {
    // The chain rule allows us to chain multiple rules and apply them one after the other.
    return (0, schematics_1.chain)([
        (tree, context) => {
            // Show the options for this Schematics.
            context.logger.info('My Other Schematic: ' + JSON.stringify(options));
            // Create a single file. Since this tree is not branched, we are working in the
            // same staging area as the other schematic, and as such cannot create the same
            // file twice.
            tree.create('hola', 'mundo');
        },
        // The schematic Rule calls the schematic from the same collection, with the options
        // passed in. Please note that if the schematic has a schema, the options will be
        // validated and could throw, e.g. if a required option is missing.
        (0, schematics_1.schematic)('my-schematic', { option: true }),
        (tree) => {
            // But since we're working off the same staging area, we can move the file created
            // by the schematic above.
            tree.rename('hello', 'allo');
        },
    ]);
}
//# sourceMappingURL=index.js.map