var g_initialRequestMade = false;
var g_initialRequestCompleted = false;
var g_initialRequest = null;
var g_initialRequestResponse = null;
var g_initialResponseTime = null;
var g_initialRequestInvokedTime = null;

function makeInitialRequest(appSettings) {
	var userSessionId = appSettings["SessionId"];
	var buildVersion = appSettings["BuildVersion"];
	var wacCluster = appSettings["WacCluster"];
	var url = appSettings["WebServiceBase"] + "OneNote.ashx";
	var canary = appSettings["Canary"];
	var accessToken = appSettings["AccessToken"];
	var userType = appSettings["UserType"];
	var mode = (appSettings["WordMode"] == "true") ? 2 : 1;
	var logHostRequests = (appSettings["LogHostRequests"] == "true") ? 1 : 0;
	var fileId = Sys.Serialization.JavaScriptSerializer.serialize(appSettings["RootQuerySignature"]);
	fileId = fileId.substring(1, fileId.length - 1);
	var pageTarget = Sys.Serialization.JavaScriptSerializer.serialize(appSettings["PageTarget"]);
	pageTarget = pageTarget.substring(1, pageTarget.length - 1);
	var initialParaId = parseInt(appSettings["InitialParaId"], 16) || 0;
	var isShowPageStats = (appSettings["ShowPageStats"] == "True") ? 1 : 0;
	var isNewWordFile = (mode == 2) && (appSettings["CreateNew"] == "true");
	var isNewOneNoteFile = (mode == 1) && (appSettings["CreateNew"] == "true");
	var requestUrl = Sys.Serialization.JavaScriptSerializer.serialize(window.location.href);

	// Don't activate the bootstrapper when making a new notebook because it may interfere with other replicators
	// attempting to make PutChangesRequests
	if (isNewOneNoteFile) {
		return;
	}

	var body = "{\"Mode\":" + mode + ",\"srs\":[[1,{\"FileId\":\"" + fileId + "\",\"PageTarget\":\"" + pageTarget + "\",\"SearchQuery\":null" + ",\"OperationId\":1" + ",\"IsNewFile\":" + isNewWordFile + ",\"InitialParaId\":" + initialParaId + ",\"RequestUrl\":" + requestUrl + "}]]}";

	var request = new Sys.Net.WebRequest();
	request.set_url(url);
	request.get_headers()['X-xhr'] = '1';
	if (userSessionId) {
		request.get_headers()["X-UserSessionId"] = userSessionId;
	}
	if (buildVersion) {
		request.get_headers()["X-OfficeVersion"] = buildVersion;
	}
	request.set_httpVerb('POST');
	request.set_body(body);
	request.get_headers()["Content-Type"] = "application/json; charset=utf-8";
	if (canary) {
		request.get_headers()["X-Key"] = canary;
	}
	if (accessToken) {
		request.get_headers()["X-AccessToken"] = accessToken;
	}
	if (userType) {
		request.get_headers()["X-UserType"] = userType;
	}
	if (logHostRequests === 1) {
		request.get_headers()["X-LogHostRequests"] = '1';
	}
	g_initialRequestInvokedTime = new Date();
	if (isShowPageStats === 1) {
		request.get_headers()["X-ShowPageStats"] = "1";
	}
	if (wacCluster) {
		request.get_headers()["X-WacCluster"] = wacCluster;
	}
	request.add_completed(onInitialRequestCompleted);
	g_initialRequestMade = true;
	request.invoke();
}

function onInitialRequestCompleted(executor) {
	g_initialRequestCompleted = true;
	g_initialResponseTime = new Date();
	g_initialRequest = executor;
	g_initialRequestResponse = executor._xmlHttpRequest.responseText;
}
