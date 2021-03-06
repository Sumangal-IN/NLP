var app = angular.module("voiceApp", []);
app
		.controller(
				"voiceAppController",
				function($scope, $http) {
					$scope.addSpace=function(text)
					{
						return text.split('_').join(' ');
					};
					console.log('started');
					$scope.error = 0;
					var interim_text = '';
					var final_text = '';
					$scope.question = '';
					$scope.input_state = 'search-input-red';
					var ignore = true;
					// if (false) {
					if ('webkitSpeechRecognition' in window) {
						var recognition = new webkitSpeechRecognition();
						recognition.continuous = true;
						recognition.interimResults = true;
						recognition.lang = 'en-in';

						var grammar = '#JSGF V1.0; grammar colors; public <color> = castorama stores | sumangal | CE | opco | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;'
						var speechRecognitionList = new webkitSpeechGrammarList();
						speechRecognitionList.addFromString(grammar, 1);
						recognition.grammars = speechRecognitionList;

						recognition.start();

						recognition.onstart = function() {
							console.log('speak now');
						};

						recognition.onerror = function(event) {
							console.log(event.error);
						};

						recognition.onend = function() {
							console.log('end');
							final_text = '';
							interim_text = '';
							$scope.input_state = 'search-input-red';
							ignore = true;
							$scope.$apply();
							recognition.start();
						};

						recognition.onresult = function(event) {
							interim_text = '';
							for (var i = event.resultIndex; i < event.results.length; ++i) {
								console.log(event.results[i][0].transcript);
								if (!ignore) {
									if (event.results[i].isFinal) {
										final_text += event.results[i][0].transcript;
										console.log('process >> ' + final_text);
										var question = (final_text).trim()
												.toUpperCase();
										if (question.startsWith('KINGFISHER')) {
											question = question.substring(11);
										}
										$scope.question = question;
										$scope.$apply();
										final_text = '';
										interim_text = '';
										if (question.startsWith('KINGFISHER')) {
											question = question.substring(11);
										}
										if(question!='')
										{
										console
												.log('https://webagile.kingfisher.com/aka/QueryProcessor?text='
														+ question);
										$http(
												{
													method : 'GET',
													url : 'https://webagile.kingfisher.com/aka/QueryProcessor?text='
															+ question
												})
												.then(
														function successCallback(
																response) {
															console
																	.log(response.data);
															// var data =
															// JSON.parse(response.data);
															var data = response.data;
															if (data.Result == undefined) {
																$scope.error = 1;
																$scope.errortext = data.Error;
															} else {
																$scope.error = 0;
																$scope.result = data.Result;
															}
														},
														function errorCallback(
																response) {
															console
																	.log(response);
														});
										}
									} else {
										interim_text += event.results[i][0].transcript;
										var question = (final_text + ' ' + interim_text)
												.trim().toUpperCase();
										if (question.startsWith('KINGFISHER')) {
											question = question.substring(11);
										}
										$scope.question = question;
										$scope.$apply();
									}
								} else {
									if ((event.results[i][0].transcript
											.toUpperCase())
											.startsWith('KINGFISHER')) {
										$scope.input_state = 'search-input-green';
										ignore = false;
										$scope.$apply();
									}
								}
							}
						};
					}
				});