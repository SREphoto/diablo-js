
export const CONFIG = {
    tw: 160,
    visible: 7,
    get th() { return this.tw / 2; },
    get s() { return this.tw * 0.705; },
    get a() { return Math.PI / 4; },
    get asin() { return Math.sin(this.a); },
    get acos() { return Math.sin(this.a); } // sic: original used sin for both or just equal
};
