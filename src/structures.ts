/** @author Matthew James <matthew.d.james87@gmail.com> */

import Recipe from "./recipe";

/**
 * @class
 * Queue class defines a generic queue-like structure for the purposes of this
 * application. It implements a capacity, at which point overflow occurs and
 * the head element is discarded.
 */
export class Queue<T> {

    /*
     * Class Invariant:
     *      this.capacity >= 0
     *  &&  0 <= this.data.length <= this.capacity
     */

    // stores this queue's data elements
    private data: LinkedList<T>;

    // defines this queue's maximum capacity
    private capacity: number;

    /**
     * @constructor
     * Constructor can be called with no arguments or optionally with given
     * data and capacity. If data.getSize() is greater than capacity, only the
     * first i elements, where i == data.getSize(), will be retained.
     *
     * @param data
     *          an optional array of T to be used as the initial data
     * @param capacity
     *          an optional number describing the capacity of the queue
     *
     * @throws RangeError
     *          if capacity < 0
     */
    constructor(data?: Array<T>, capacity?: number) {

        this.capacity = capacity || 10;

        if (this.capacity < 0) {

            throw new RangeError("Capacity cannot be negative!");
        }

        this.data = data &&
            new LinkedList(data.slice(0, this.capacity), this.capacity) ||
            new LinkedList<T>(new Array<T>(), this.capacity);
    }

    /**
     * Method returns contents by value of this queue as a regular array.
     *
     * @returns this queue as an array
     */
    public toArray(): Array<T> {

        return new Array<T>().concat(this.data.toArray());
    }

    /**
     * Method takes as input an element, and enqueues it to the tail of this
     * queue.
     *
     * @param element
     *          the element to be enqueued to this queue
     */
    public enqueue(element: T): void {

        if (!this.data.contains(element)) {

            this.data.pushFront(element);
        }
    }

    /**
     * Method dequeues and returns the element at the head of this queue.
     *
     * @returns the element at the head of this queue
     *
     * @throws Error
     *          if this queue is empty
     */
    public dequeue(): T {

        try {

            return this.data.popBack();

        } catch (e) {

            throw new Error("Cannot dequeue from empty queue!");
        }
    }

    /**
     * Method returns the number of elements in the queue's internal storage.
     *
     * @return the number of elements in this queue
     */
    public getSize(): number {

        return this.data.getSize();
    }

    public checkInvariant(): boolean {

        if (this.data.getSize() > this.capacity) {

            console.log("Data length cannot exceed capacity!");
            return false;
        }

        if (this.capacity < 0) {

            console.log("Capacity cannot be negative!");
            return false;
        }

        return true;
    }
}

/**
 * @class
 * ListNode class represents a node containing a generic value V, with pointers
 * to next and previous nodes.
 */
class ListNode<V> {

    public value: V;
    public next: ListNode<V>;
    public prev: ListNode<V>;

    /**
     * @constructor
     * Constructor method takes as input a generic value V, and constructs a
     * new ListNode using its value. By default, a ListNode's next and previous
     * pointers are null until assignment.
     *
     * @param value
     *          a generic value to be assigned to this ListNode
     */
    constructor(value: V) {

        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

/**
 * @class
 * LinkedList class represents a minimal, doubly-linked list of generic values.
 * Note that this is a stripped down implementation for the purposes of this
 * application.
 */
class LinkedList<V> {

    /*
     * Class Invariant:
     *      0 <= this.size <= this.capacity
     *  &&  this.size must correctly represent the number of nodes in this list
     */

    private head: ListNode<V>;
    private tail: ListNode<V>;

    // stores the maximum number that can be contained in this list
    private capacity: number;

    // stores the number contained in this list at any point in time
    private size: number;

    /**
     * @constructor
     * Constructor method takes as optional input an array of generic data and
     * a capacity. If arguments are not given, an empty list with a capacity of
     * 10 is constructed.
     *
     * @require !capacity || capacity >= 0
     *
     * @param data
     *          an optional array of generic values
     * @param capacity
     *          an optional value describing the total capacity of this list
     *
     * @throws RangeError
     *          if data.length > capacity
     */
    constructor(data?: Array<V>, capacity?: number) {

        this.head = null;
        this.tail = null;
        this.capacity = capacity || 10;
        this.size = 0;

        if (data) {

            if (data.length > this.capacity) {

                throw new RangeError("Size of data cannot exceed capacity!");
            }

            for (let elem of data) {

                this.pushFront(elem);
            }
        }
    }

    /**
     * Method takes as input a generic value V and adds it to the end of this
     * list.
     *
     * @param value
     *          a generic value to be added to the end of this list
     */
    public pushFront(value: V): void {

        let valueNode = new ListNode(value);

        if (!this.head) {

            this.head = valueNode;
            this.tail = valueNode;

        } else {

            if (this.size === this.capacity) {

                this.popBack();
            }

            valueNode.next = this.head;
            this.head.prev = valueNode;
            this.head = valueNode;
        }

        this.size++;
    }

    /**
     * Method removes the first element in this list and returns it.
     *
     * @return the first element of this list
     *
     * @throws Error
     *          if this list is empty
     */
    public popBack(): V {

        if (this.size === 0) {

            throw new Error("Cannot pop empty list!");
        }

        let temp = this.tail;
        if (this.size === 1) {

            this.head = null;
            this.tail = null;

        } else {

            this.tail.prev = this.tail;
            this.tail.next = null;
        }

        this.size--;

        return temp.value;
    }

    /**
     * Method returns the contents of this list as a regular array.
     *
     * @return this list as an array
     */
    public toArray(): Array<V> {

        let result = new Array<V>();
        if (this.size === 0) {

            return result;

        } else {

            result.push(this.head.value);
            let node = this.head;

            for (let i = 1; i < this.size; i++) {

                result.push(node.next.value);
                node = node.next;
            }
        }

        return result;
    }

    /**
     * Method takes as input an element and returns whether it is contained in
     * this list. Note that for the purposes of this application, the only data
     * type currently supported for the given element is Recipe.
     *
     * @param element
     *          an element to search this queue for
     *
     * @returns whether element is contained in this list
     */
    public contains(element: any): boolean {

        let elementAsType: any;

        if (element instanceof Recipe) {

            elementAsType = <Recipe>element;

        } else {

            return false;
        }

        for (let elem of this.toArray()) {

            if (elementAsType.equals(elem)) {

                return true;
            }
        }

        return false;
    }

    /**
     * Method returns the size, or number of elements, within this list.
     *
     * @returns the number of elements in this list
     */
    public getSize() {

        return this.size;
    }
}
