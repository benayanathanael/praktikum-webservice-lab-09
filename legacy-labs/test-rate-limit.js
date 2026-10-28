(async () => {
  for (let i = 1; i <= 30; i++) {
    const res = await fetch('http://localhost:8080/service-a/');
    console.log(i, res.status);
  }
})();
