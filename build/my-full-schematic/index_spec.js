"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const testing_1 = require("@angular-devkit/schematics/testing");
const path = require("path");
// SchematicTestRunner needs an absolute path to the collection to test.
const collectionPath = path.join(__dirname, '../collection.json');
describe('my-full-schematic', () => {
    it('requires required option', () => __awaiter(void 0, void 0, void 0, function* () {
        // We test that
        const runner = new testing_1.SchematicTestRunner('schematics', collectionPath);
        yield expectAsync(runner.runSchematic('my-full-schematic', {}, schematics_1.Tree.empty())).toBeRejected();
    }));
    it('works', () => __awaiter(void 0, void 0, void 0, function* () {
        const runner = new testing_1.SchematicTestRunner('schematics', collectionPath);
        const tree = yield runner.runSchematic('my-full-schematic', { name: 'str' }, schematics_1.Tree.empty());
        // Listing files
        expect(tree.files.sort()).toEqual(['/allo', '/hola', '/test1', '/test2']);
    }));
});
//# sourceMappingURL=index_spec.js.map