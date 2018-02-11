//
// SENG 513 - Web-Based Systems
// University of Calgary, Winter 2018
// Assignment 2
//
// Joel McFadden
//

//
// Replace characters that are not alphanumeric with a space.
//     - txt: String
//
function filterAlnum(txt) {
    let res = "";
    for (let i = 0; i < txt.length; i++) {
        let c = txt.charAt(i);
        res += (/^[a-z0-9]$/.test(c)) ? c : " ";
    }
    return res;
}

//
// Compare words: first by length, then alphabetically.
//     - str1, str2: Strings
//
function compareWords(str1, str2) {
    if (str1.length > str2.length) {
        return -1;
    }
    if (str1.length < str2.length) {
        return 1;
    }
    if (str1 < str2) {
        return -1;
    }
    if (str1 > str2) {
        return 1;
    }
    return 0;
}

//
// Compare word frequencies: first by occurence, then alphabetically.
//     - freq1, freq2: String, number lists: ['word', <count>]
//
function comparefreq(freq1, freq2) {
    if (freq1[1] > freq2[1]) {
        return -1;
    }
    if (freq1[1] < freq2[1]) {
        return 1;
    }
    if (freq1[0] < freq2[0]) {
        return -1;
    }
    if (freq1[0] > freq2[0]) {
        return 1;
    }
    return 0;
}

//
// Calculate statistics for a given string of text.
//     - txt: String
//
function getStats(txt) { // eslint-disable-line no-unused-vars
    const orig = txt;
    txt = txt.toLowerCase();
    let lines = txt.split("\n");
    let words = filterAlnum(txt).split(" ").filter(w => w.length > 0);
    let nonEmptyLines = lines.filter(l => l.trim().length > 0);

    let uniqueWords = [...new Set(words)];

    // filter for palindromes (word must be > 2 chars and same in reverse)
    let palisd = uniqueWords.filter(w => w.length > 2 && w === [...w].reverse().join(""));

    // map each word to its frequency
    let mmfq = new Map();
    uniqueWords.forEach(w => { mmfq[w] = 0; });
    words.forEach(w => { mmfq[w] += 1; });

    // convert map to list of lists: e.g. [['word1', 3], ['word2', 5]]
    let lmfq = [];
    uniqueWords.forEach(w => lmfq.push([w, mmfq[w]]));

    // build result object
    let res = {};
    res["nChars"] = orig.length;
    res["nWords"] = words.length;
    res["nLines"] = (orig === "" ? 0 : lines.length);
    res["nonEmptyLines"] = nonEmptyLines.length;

    // compute the length of each line and then take the max
    res["maxLineLength"] = Math.max(...lines.map(l => l.length));

    // sum the lengths of each word and divide by the number of words; unless number of words is zero, return zero
    res["averageWordLength"] = (res["nWords"] !== 0) ? words.map(w => w.length).reduce((x, y) => x + y, 0) / res["nWords"] : 0;

    res["palindromes"] = palisd;

    // use custom compare functions to order lists; add formatting for most frequent words
    res["longestWords"] = uniqueWords.sort(compareWords).slice(0, 10);
    res["mostFrequentWords"] = lmfq.sort(comparefreq).map((e) => e[0] + "(" + e[1] + ")").slice(0, 10);

    return res;
}
