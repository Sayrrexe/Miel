export function checkImage(url: string) {
  const request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onload = function () {
    if (request.status == 200) {
      //if(statusText == OK)
      console.log("image exists");
      return 1;
    } else {
      console.log("image doesn't exist");
      return 0;
    }
  };
  request.send();
}
