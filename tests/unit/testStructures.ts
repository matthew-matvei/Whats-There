/// <reference path="../../typings/index.d.ts" />

let expect = require("chai").expect;

import { Queue } from "../../src/structures";

/** Test suite for class Queue. */
describe("Class Queue's", function () {

    let testQueue: Queue<string>;
    let testData: Array<string>;
    let testCapacity: number;

    afterEach(function () {

        expect(testQueue.checkInvariant()).to.be.true;
    });

    describe("constructor", function () {

        before(function () {

            testData = new Array<string>("one", "two");
            testCapacity = 5;
        });

        it("constructs with undefined data and capacity", function () {

            testQueue = new Queue<string>();

            // test handled by afterEach hook
        });

        it("constructs with defined data, undefined capacity", function () {

            testQueue = new Queue<string>(testData);

            // test handled by afterEach hook
        });

        it("constructs with undefined data, defined capacity", function () {

            testQueue = new Queue<string>(undefined, testCapacity);

            // test handled by afterEach hook
        });

        it("constructs with defined data and capacity", function () {

            testQueue = new Queue<string>(testData, testCapacity);

            // test handled by afterEach hook
        });

        it("constructs with larger data than capacity", function () {

            testData.push("three", "four", "five", "six");
            testQueue = new Queue<string>(testData, testCapacity);

            // test handled by afterEach hook
        });

        it("throws RangeError if capacity < 0", function () {

            let badConstruction = function () {

                return new Queue<string>(testData, -5);
            };

            expect(badConstruction).to.throw(RangeError);

            // satisfy afterEach hook
            testQueue = new Queue<string>();
        });
    });

    describe("toArray method", function () {

        let expectedArray: Array<string>;

        it("converts an empty queue", function () {

            testQueue = new Queue<string>();
            expectedArray = new Array<string>();

            expect(testQueue.toArray()).to.deep.equal(expectedArray);
        });

        it("converts a queue of length one", function () {

            testQueue = new Queue<string>(["one"]);
            expectedArray = new Array<string>("one");

            expect(testQueue.toArray()).to.deep.equal(expectedArray);
        });

        it("converts a queue of length two", function () {

            testQueue = new Queue<string>(["one", "two"]);
            expectedArray = new Array<string>("two", "one");

            expect(testQueue.toArray()).to.deep.equal(expectedArray);
        });

        it("converts a queue of length three", function () {

            testQueue = new Queue<string>(["one", "two", "three"]);
            expectedArray = new Array<string>("three", "two", "one");

            expect(testQueue.toArray()).to.deep.equal(expectedArray);
        });
    });

    describe("enqueue method", function () {

        it("appends to empty queue", function () {

            testQueue = new Queue<string>();
            testQueue.enqueue("one");

            // test handled by afterEach hook
        });

        it("appends to queue of length one", function () {

            testQueue = new Queue<string>(["one"]);
            testQueue.enqueue("two");

            // test handled by afterEach hook
        });

        it("appends to queue of length two", function () {

            testQueue = new Queue<string>(["one", "two"]);
            testQueue.enqueue("three");

            // test handled by afterEach hook
        });

        it("appends to queue of length three", function () {

            testQueue = new Queue<string>(["one", "two", "three"]);
            testQueue.enqueue("four");

            // test handled by afterEach hook
        });
    });

    describe("dequeue method", function () {

        let expected: string;

        it("pops from queue of size one", function () {

            testQueue = new Queue<string>(["one"]);
            expected = "one";

            expect(testQueue.dequeue()).to.equal(expected);
        });

        it("pops from queue of size two", function () {

            testQueue = new Queue<string>(["one", "two"]);
            expected = "one";

            expect(testQueue.dequeue()).to.equal(expected);
        });

        it("pops from queue of size three", function () {

            testQueue = new Queue<string>(["one", "two", "three"]);
            expected = "one";

            expect(testQueue.dequeue()).to.equal(expected);
        });

        it("throws Error if queue is empty", function () {

            testQueue = new Queue<string>();

            expect(testQueue.dequeue).to.throw(Error);
        });
    });
});
