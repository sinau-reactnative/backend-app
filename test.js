const findSame = input => {
  if (typeof input !== "object") {
    return console.log("PASTIKAN ITU ARRAY");
  }
  let result = input;
  let _result = [];
  const _input = input.map(e =>
    e
      .split("")
      .sort()
      .join("")
  );
  let _input2 = [];
  let _input3 = [];
  console.log(_input);
  for (let i = 0; i < _input.length; i++) {
    for (let j = 0; j < _input.length; j++) {
      if (_input[i] === _input[j]) {
        _input3.push(_input[i]);
        console.log(_input[i], i);
        if (!_result.some(e => e === result[i])) {
          _result.push(result[i]);
        }
      }
    }
  }

  console.log(_result);
  //   return console.log(result);
};

// findSame([
//   "man",
//   "list",
//   "acme",
//   "talk",
//   "cat",
//   "beach",
//   "came",
//   "tac",
//   "naan",
//   "slit",
//   "act"
// ]);
findSame(["oke", "ulala", "asik", "eko"]);
//findSame("gasss!");

const d = new Date();
const date = d.getDate();
const month = d.getMonth() + 1 ? "0" + (d.getMonth() + 1) : date;
const year = d.getFullYear();
const fullDate = `${year}-${month}-${date}`;

console.log(fullDate);
