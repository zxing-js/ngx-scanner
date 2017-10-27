"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultGridSampler_1 = require("./DefaultGridSampler");
var GridSamplerInstance = (function () {
    function GridSamplerInstance() {
    }
    /**
     * Sets the implementation of GridSampler used by the library. One global
     * instance is stored, which may sound problematic. But, the implementation provided
     * ought to be appropriate for the entire platform, and all uses of this library
     * in the whole lifetime of the JVM. For instance, an Android activity can swap in
     * an implementation that takes advantage of native platform libraries.
     *
     * @param newGridSampler The platform-specific object to install.
     */
    GridSamplerInstance.setGridSampler = function (newGridSampler) {
        GridSamplerInstance.gridSampler = newGridSampler;
    };
    /**
     * @return the current implementation of GridSampler
     */
    GridSamplerInstance.getInstance = function () {
        return GridSamplerInstance.gridSampler;
    };
    return GridSamplerInstance;
}());
GridSamplerInstance.gridSampler = new DefaultGridSampler_1.default();
exports.default = GridSamplerInstance;
//# sourceMappingURL=GridSamplerInstance.js.map