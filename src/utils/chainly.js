import { Map, List } from "immutable";

export function chainly(stream) {
    let parser = (data) => {
        data = data ? Map(data) : Map({});
    };

    function id(value, modifier) {
        let next_token = stream.peek();
    }
}