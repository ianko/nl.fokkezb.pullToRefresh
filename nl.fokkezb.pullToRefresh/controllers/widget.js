var refreshControl;

$.refresh = refresh;

$.hide = hide;
$.show = show;

(function constructor(args) {

  if (!OS_IOS && !OS_ANDROID) {
    console.warn('[pullToRefresh] only supports iOS and Android.');
    return;
  }

  // ignore the <require> elements inside the widget
  var list = _.find(args.children, function(child) {
    if (!child.apiName)
      return false;

    return _.contains(['Ti.UI.ListView', 'Ti.UI.TableView', 'de.marcelpociot.CollectionView'], child.apiName);
  });

  if (!list) {
    console.error('[pullToRefresh] is missing required Ti.UI.ListView or Ti.UI.TableView or de.marcelpociot.CollectionView as first child element.');
    return;
  }

  delete args.children;

  _.extend($, args);

  if (OS_IOS) {
    refreshControl = Ti.UI.createRefreshControl();
    refreshControl.addEventListener('refreshstart', onRefreshstart);

    list.refreshControl = refreshControl;

    $.addTopLevelView(list);

  } else if (OS_ANDROID) {
    refreshControl = require('com.rkam.swiperefreshlayout').createSwipeRefresh({
      view: list
    });

    refreshControl.addEventListener('refreshing', onRefreshstart);

    $.addTopLevelView(refreshControl);
  }

})(arguments[0] || {});

function refresh() {
  show();

  onRefreshstart();
}

function hide() {

  if (OS_IOS) {
    refreshControl.endRefreshing();

  } else if (OS_ANDROID) {
    refreshControl.setRefreshing(false);
  }
}

function show() {

  if (OS_IOS) {
    refreshControl.beginRefreshing();

  } else if (OS_ANDROID) {
    refreshControl.setRefreshing(true);
  }
}

function onRefreshstart() {

  $.trigger('release', {
    source: $,
    hide: hide
  });

}
