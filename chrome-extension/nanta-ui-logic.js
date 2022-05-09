const style = `
  <style>
    .nanta-ui {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99999 !important;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-direction: column;
    }

    .nanta-ui.hidden {
      display: none;
    }
  </style>
`;

const html = `
  ${style}
  <div id="nanta-ui" class="nanta-ui hidden">
    <div class="nanta-ui__search">
      <input type="text" placeholder="search"/>
    </div>
    <div class="nanta-ui__display"><div>
  </div>
`;

window.onload = () => {
  document.body.insertAdjacentHTML('beforeend', html);
};