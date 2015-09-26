import adminApp from 'dm-admin/dm-admin-app';

adminApp.controller('dmAdminPerf', ['$scope', 'Sockets', function ($scope, Sockets) {
  $scope.startTest = function () {
    Sockets.emit('perfTest.start', $scope.testText);
  };

  $scope.stopTest = function () {
    Sockets.emit('perfTest.stop');
  };

  $scope.sendResults = function () {
    Sockets.emit('perfTest.sendResults');
  };

  $scope.testText = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>EcoFood</title>
  <link rel="stylesheet"
    href="//local.xplatform.org/cdn/rwd/1.0.0/css/normalize.css">
  <link rel="stylesheet"
    href="//local.xplatform.org/cdn/rwd/1.0.0/css/fonts.css">
  <link rel="stylesheet"
    href="//local.xplatform.org/cdn/rwd/1.0.0/css/icons.css">

  <link rel="stylesheet" href="css/general.css">
  <link rel="stylesheet" href="css/section.css">
  <link rel="stylesheet" href="css/navigation.css">
  <link rel="stylesheet" href="css/buttons.css">
  <link rel="stylesheet" href="css/form.css">

</head>
<body>
  <header id="home" class="section section--hero">
      <div class="container clearfix">
        <a class="logo" href="#" title="EcoFood">
          <img
            src="//local.xplatform.org/cdn/rwd/1.0.0/images/branding/ecofood_logo.png"
            title="EcoFood"
            alt="EcoFood">
        </a>
        <nav class="navigation">
          <ul class="navigation__list">
            <li>
                <a href="#home" title="Home">Home</a>
            </li>
            <li>
                <a href="#features" title="Features">Features</a>
            </li>
            <li>
                <a href="#about" title="Who uses?">About</a>
            </li>
            <li>
                <a href="#who-uses" title="Who uses?">Who uses?</a>
            </li>
            <li>
                <a href="#buy-now" title="Buy now!">Buy now!</a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="container clearfix">
        <div class="section--hero__headings">
          <h2 class="site-title">Apple</h2>
          <h3 class="site-slogan">Malus domestica</h3>
        </div>

        <div class="section--hero__description">
          <p class="section--hero__description__text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            Excepteur sint occaecat cupidatat non proident,
            sunt in culpa qui officia deserunt mollit anim id est.
          </p>
          <a class="button button--green section--hero__description__button" href="#">
            Buy Now!
          </a>
        </div>
      </div>
  </header>
  <script src="//local.xplatform.org/cdn/jquery/2.1.4/jquery.js"></script>
  <script src="scripts.js"></script>
</body>
</html>
    `;
}]);
