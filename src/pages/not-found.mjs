export default {
    render() {
        document.body.innerHTML = `
			<a href="#/"><i class="bi bi-arrow-left link-icon"></i></a>
			<theme-switcher></theme-switcher>
            <pre>$ tuxsay '404: Not Found'
  ----------------
|  404: Not Found  |
  ----------------
    \\
     \\
        .--.
       |o_o |
       |:_/ |
      //   \\ \\
     (|     | )
    /'\\_   _/'\\
    \\___)=(___/
            </pre>
        `;
    }
}
