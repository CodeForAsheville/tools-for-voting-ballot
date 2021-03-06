



var TFVB = {};

TFVB.first_name = false;
TFVB.last_name = false;
TFVB.voter_age = false;
TFVB.voter_registration_api_base = "https://cfa-voting-api-2016.herokuapp.com/api";
TFVB.voter_ballot_api_call = "/ballot";

//TFVB.election_description_sheet = "https://raw.githubusercontent.com/CodeForAsheville/tools-for-voting-ballot/master/election_races.csv";
TFVB.election_lookup_sheet = "1md9fVzlgIGW09mbdPYR8oNj5CEEhHNTcjsNeTzij6YM";
// TFVB.election_lookup_sheet = "https://raw.githubusercontent.com/CodeForAsheville/tools-for-voting-ballot/master/election_lookup.csv";

TFVB.voter_record = false;

TFVB.voter_search_results = false;

TFVB.election_lookup_data = false;

TFVB.election_race_info_data = false;

TFVB.election_race_info_data_processed = {};
TFVB.election_lookup_data_processed = {};


TFVB.display_voter_info_keys = ['id','cong_dist_abbrv', 'county_id', 'county_desc', 'birth_age', 'dist_1_desc', 'dist_2_desc', 'mail_addr1', 'mail_city', 'mail_state', 'mail_zip', 'school_dist_abbrv', 'voter_reg_num'];


TFVB.debug = false;
TFVB.setupDebugTools = function(){
	if(TFVB.debug){
		$("#full-name").val("Jesse Michel");
		// $("#first-name").val("Patrick");
		// $("#last-name").val("Conant");

		$("#enter-name").click();
	}
}

TFVB.setVoterBallotURL = function(response){
	console.log('ballot response', response);

	$(".sample-ballot-button").attr('href', response.ballot);

	$(".sample-ballot-button-container").fadeIn();

};

TFVB.getVoterBallot = function(){
	var voter_api_request_url = TFVB.voter_registration_api_base + TFVB.voter_ballot_api_call + "?voternum="+TFVB.voter_record.voter_reg_num;

	console.log('voter ballot call', voter_api_request_url);

	$.get(voter_api_request_url, TFVB.setVoterBallotURL);
};

TFVB.processVoterRowClick = function(){
	var active_row = $(this);
	console.log('row click', active_row);

	var active_index = active_row.attr('data-voter-index');

	TFVB.voter_record = TFVB.voter_search_results[active_index];


	$("#single-voter-detail").find('.voter-name').html(TFVB.voter_record.first_name + " " +TFVB.voter_record.last_name);
	$("#single-voter-detail h2").html("");
	$("#single-voter-additional-info").html("");

	// Start the lookup!

	for(key in TFVB.voter_record){
		row = TFVB.voter_record[key];

		// console.log('check in array', $.inArray(key, TFVB.display_voter_info_keys), key)

		// Temp disable
		if($.inArray(key, TFVB.display_voter_info_keys) > -1){

			$("#single-voter-additional-info").append("<div class='voter-info-row'><span class='voter-info-key'>" + key.replace("_", " ").toUpperCase() + ":</span>" + " <span class='voter-info-value'>" + row + "</span></div>");
		}
	}

	TFVB.getVoterBallot();

	TFVB.filterVoterElections();
	$(".step2, .show-voter-info").fadeIn();
	$("#results h3").hide();

}

TFVB.filterVoterElections = function(){

	// nc_house_abbrv
	var voter_nc_house_district = TFVB.voter_record.nc_house_abbrv;
	var voter_us_house_district = TFVB.voter_record.cong_dist_abbrv;
	var voter_nc_senate_district = TFVB.voter_record.nc_senate_abbrv;
	var voter_municipality = TFVB.voter_record.munic_dist_desc;
	var voter_municipality_abbrv = TFVB.voter_record.munic_dist_abbrv;
	var commissioner_district = TFVB.voter_record.county_commiss_abbrv.replace("COM", "");

	var voter_education_district = TFVB.voter_record.school_dist_abbrv;



	// data-election-name
	// data-election-base-name

	$(".ballot-section[data-election-base-name='US HOUSE OF REPRESENTATIVES']").hide();
	$(".ballot-section[data-election-name='US HOUSE OF REPRESENTATIVES DISTRICT "+voter_us_house_district+"']").show();

	$(".ballot-section[data-election-base-name='NC HOUSE OF REPRESENTATIVES DISTRICT']").hide();
	$(".ballot-section[data-election-name='NC HOUSE OF REPRESENTATIVES DISTRICT "+voter_nc_house_district+"']").show();

	$(".ballot-section[data-election-base-name='BUNCOMBE COUNTY BOARD OF COMMISSIONERS']").hide();

	$(".ballot-section[data-election-name='BUNCOMBE COUNTY BOARD OF COMMISSIONERS DISTRICT "+commissioner_district+"']").show();
	$(".ballot-section[data-election-name='BUNCOMBE COUNTY BOARD OF COMMISSIONERS DISTRICT "+commissioner_district+" UNEXPIRED']").show();
	$(".ballot-section[data-election-name='BUNCOMBE COUNTY BOARD OF COMMISSIONERS CHAIR']").show();


	//nc_senate_abbrv
	$(".ballot-section[data-election-base-name='NC STATE SENATE DISTRICT']").hide();
	$(".ballot-section[data-election-name='NC STATE SENATE DISTRICT "+voter_nc_senate_district+"']").show();

	if(voter_education_district){
		$(".ballot-section[data-election-base-name='BUNCOMBE COUNTY BOARD OF EDUCATION']").show();
	}
	else{
		$(".ballot-section[data-election-base-name='BUNCOMBE COUNTY BOARD OF EDUCATION']").hide();
	}

	if (voter_municipality == 'CITY OF ASHEVILLE' || voter_municipality_abbrv == 'ASHE') {
		$(".ballot-section[data-election-base-name='ASHEVILLE GENERAL OBLIGATION TRANSPORTATION BONDS']").show();
		$(".ballot-section[data-election-base-name='ASHEVILLE GENERAL OBLIGATION HOUSING BONDS']").show();
		$(".ballot-section[data-election-base-name='ASHEVILLE GENERAL OBLIGATION PARKS AND RECREATION BONDS']").show();
	}
	else {
		$(".ballot-section[data-election-base-name='ASHEVILLE GENERAL OBLIGATION TRANSPORTATION BONDS']").hide();
		$(".ballot-section[data-election-base-name='ASHEVILLE GENERAL OBLIGATION HOUSING BONDS']").hide();
		$(".ballot-section[data-election-base-name='ASHEVILLE GENERAL OBLIGATION PARKS AND RECREATION BONDS']").hide();
	}

	if (voter_municipality == 'TOWN OF WOODFIN' || voter_municipality_abbrv == 'WFIN') {
		$(".ballot-section[data-election-base-name='WOODFIN GENERAL OBLIGATION PARKS AND RECREATION BONDS']").show();
	}
	else {
		$(".ballot-section[data-election-base-name='WOODFIN GENERAL OBLIGATION PARKS AND RECREATION BONDS']").hide();
	}
	// $(".ballot-section[data-election-base-name='BUNCOMBE COUNTY BOARD OF EDUCATION']").hide();
	// $(".ballot-section[data-election-name='BUNCOMBE COUNTY BOARD OF EDUCATION "+voter_education_district+" DISTRICT']").show();
	// $(".ballot-section[data-election-base-name='BUNCOMBE COUNTY BOARD OF EDUCATION AT- LARGE']").show();

//
};

TFVB.processVoterSearchResults = function(results){
	console.log('results', results);

	TFVB.voter_search_results = results;

	results_div = $("#results");

	results_div.html("");

	if(results.length){
		results_div.append("<h3>Choose your name from the list below:</h3>");
		for(index in results){
			row = results[index];

			// Remove inactivate results
			if(row.voter_status_desc != "ACTIVE"){
				continue;
			}

			results_div.append("<div>" +
									"<div class='voter-row' data-voter-index='"+index+"' style='text-decoration: underline; cursor: pointer;'>" + row.first_name + " " + row.last_name + " (Age " + row.birth_age + ")</div>" +
								"</div>"
								);
		}

	}
};

TFVB.getVoterInfo = function(){

	var voter_registration_request_url = TFVB.voter_registration_api_base + "?fname="+TFVB.first_name+"&lname="+TFVB.last_name;

	console.log('voter registration call', voter_registration_request_url);

	if(TFVB.voter_age){
		voter_registration_request_url += "&age=" + TFVB.age;
	}

	$.get(voter_registration_request_url, TFVB.processVoterSearchResults);

	// "&age="
	// ?lname=jackson&fname=philip&age=54
};

TFVB.processVoterName = function(){
	$(".step2").hide();

	var full_name = $("#full-name").val();

	var full_name_array = full_name.split(" ");

	// console.log(full_name, full_name_array);
	if(full_name_array.length < 2){
		alert("Please enter your full name");
	}

	TFVB.first_name = full_name_array[0];
	TFVB.last_name = full_name_array[1];

	if($("#voter-age").length){
		TFVB.voter_age = $("#voter-age").val();
	}

	$("#results").html("Loading...<img class='spinner small' src='img/spinner.svg'/>");
	$("#single-voter-detail h2").html("");
	$("#single-voter-additional-info").html("");

	// $("#results").html(TFVB.first_name + ": " + TFVB.last_name);
	TFVB.getVoterInfo();
	return false;
};

console.log(TFVB.election_lookup_data_processed);

TFVB.processElectionLookupData = function(){
	for(index in TFVB.election_lookup_data){
		var row = TFVB.election_lookup_data[index];

		// if(! row.contest_id){
			if(typeof TFVB.election_lookup_data_processed[row["contest_name - original"]] == typeof undefined){
				TFVB.election_lookup_data_processed[row["contest_name - original"]] = [];
			}
			TFVB.election_lookup_data_processed[row["contest_name - original"]].push(row);
		// }
	}
};

TFVB.getPartyFromAbrev = function(input){
	if(input == "DEM"){
		return "democrat";
	}
	else if(input == "REP"){
		return "republican";
	}
	else if(input == "LIB"){
		return "libertarian";
	}
	else if(input == "UNA"){
		return "unaffiliated";
	}
	else if(input == "REF"){
		return "referendum";
	}
	else{
		return "";
	}
}

console.log('lookup: ', TFVB.election_lookup_data_processed);

TFVB.renderElectionRaces = function(){
	var candidate_template = $(".ballot-section-options").find('li').eq(0).clone();
	$(".ballot-section-options").find('li').remove();

	var ballot_section_template = $(".ballot-section").clone();
	$(".ballot-section").remove();

	for(election_race_name in TFVB.election_lookup_data_processed){
		var election_race = TFVB.election_lookup_data_processed[election_race_name];
		var active_section = ballot_section_template.clone();

		// console.log('race', election_race);
		active_section.attr('data-election-name', election_race_name);
		active_section.attr('data-election-base-name', election_race[0]["contest_name - base"]);

		for(candidate_index in election_race){
			candidate = election_race[candidate_index];
			// console.log('candidate', candidate);

			var active_candidate = candidate_template.clone();
			active_candidate.find('.candidate-name').html(candidate.name_on_ballot).attr('data-candidate-name', candidate.name_on_ballot);
			active_candidate.find('.candidate-party').html(TFVB.getPartyFromAbrev(candidate.party_candidate) );

			if (candidate.withdrawn) {
				active_candidate.find('.candidate-info-container').html("<p>This candidate has withdrawn from the race.</p>");
				active_candidate.find('.actions').remove();
			}
			else {
				var site_link = null;
				var site_name = (candidate.website_name)?candidate.website_name:"Campaign Website";
				if (candidate.website) {
					site_link = "<a target='_blank' href='" + candidate.website + "'>";
					site_link += site_name;
					site_link += "</a>";
				}
				active_candidate.find('.candidate-website').html("");
				if (site_link) {
					active_candidate.find('.candidate-website').append(site_link);
				}

				var media_links = [false, false, false, false];
				var search_term = (candidate.search_term)?candidate.search_term:candidate.name_on_ballot;
				var newsobserver_link = "<a target='_blank' href='http://www.newsobserver.com/search/?q=";
				 	newsobserver_link += search_term.replace(/\ /g,'+') + "'>";
					newsobserver_link += "Search on Raleigh News & Observer";
				newsobserver_link += "</a>";

				var xpress_link = "<a target='_blank' href='http://mountainx.com/?s=";
					xpress_link += search_term.replace(/\ /g,'+') + "'>";
					xpress_link += "Search on Mountain Xpress";
				xpress_link += "</a>";

				var blade_link = "<a target='_blank' href='http://www.ashevilleblade.com/?s=";
					blade_link += search_term.replace(/\ /g,'+') + "'>";
					blade_link += "Search on Asheville Blade";
				blade_link += "</a>";

				var act_link = "<a target='_blank' href='http://www.citizen-times.com/search/" + search_term + "/'>";
					act_link += "Search on Asheville Citizen Times ";
				act_link += "</a>";

				var mpick = candidate.media.split(',');
				for (var i=0; i<mpick.length; ++i) {
					media_links[mpick[i]] = true;
				}
				active_candidate.find('.candidate-info p').html("");
				if (media_links[0]) active_candidate.find('.candidate-info p').append(blade_link );
				if (media_links[1]) active_candidate.find('.candidate-info p').append(act_link );
				if (media_links[2]) active_candidate.find('.candidate-info p').append(xpress_link );
				if (media_links[3]) active_candidate.find('.candidate-info p').append(newsobserver_link );

			}
			active_candidate.removeClass('selected').addClass(TFVB.getPartyFromAbrev(candidate.party_candidate));

			if(active_candidate.hasClass('referendum')){
				active_candidate.find('a.select-candidate').text(active_candidate.find('.candidate-name').text());
			}
			active_section.find('ul').append(active_candidate);

		}

		active_section.find('h2').html(election_race_name);

		if(typeof TFVB.election_race_info_data_processed[election_race_name] != typeof undefined){
			var target_elm = active_section.find('.ballot-section-info');
			target_elm.html(TFVB.election_race_info_data_processed[election_race_name]["Short Description of Office"]);

			links = TFVB.election_race_info_data_processed[election_race_name]["Sources"].split(" ");
			// console.log(links);

			link_html = "<h2>Sources:</h2>";

			link_html += "<ul class='election-description-link-list'>";

			var link_match = false;
			for(index in links){
				link = links[index];
				if(link.indexOf('http') != -1){
					link_match = true;
					link_html += "<li><a target='_blank' href='" + link + "'>" + link + "</a></li>";
				}
			}
			link_html += "</ul>";

			if(link_match){
				target_elm.append(link_html);
			}


		}

		$(".ballot-container").append(active_section);
	}

	// TFVB.renderElectionRaces();
};


TFVB.processElectionInfoData = function(){
	for(index in TFVB.election_race_info_data){
		var row = TFVB.election_race_info_data[index];
		// console.log('patrick', row["contest_name - original"]);
		TFVB.election_race_info_data_processed[row["contest_name - original"]] = row;
	}
};


/// TABLETOP STUFF
TFVB.init = function(){
	Tabletop.init( { key: TFVB.election_lookup_sheet,
	                 callback: TFVB.loadGoogleSpreadsheetData,
	                 simpleSheet: false } );
}

TFVB.loadGoogleSpreadsheetData = function(data, tabletop) {
	// alert("Successfully processed!")
	// console.log(data);
	console.log("Data Loaded");
	TFVB.election_lookup_data = data.Candidates.elements;
	TFVB.election_race_info_data = data.Races.elements;

	// console.log('election lookup data', TFVB.election_lookup_data);

	TFVB.processElectionLookupData();
	TFVB.processElectionInfoData();

	TFVB.renderElectionRaces();
	TFVB.setupDebugTools();

	TFVB.loaded_selections = TFVB.decodeURL();
	TFVB.prePopulate();
	if(TFVB.prePopulateMode ){
		TFVB.activateStep2();
		$('.ballot-description').hide();
	}
	else{
		TFVB.activateStep1();

	}

}
// END TABLETOP


// On Load, Get the lookup
window.onload = function() { TFVB.init(); };

// Click handlers
$("#enter-name").click(TFVB.processVoterName);

$(document).on('click', '.voter-row', TFVB.processVoterRowClick);
