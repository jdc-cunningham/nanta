const html = `
  <div id="yo">
    <h1>Injected</h1>
  </div>
`;

console.log(document.body);

document.body.insertAdjacentHTML('beforeend', html);