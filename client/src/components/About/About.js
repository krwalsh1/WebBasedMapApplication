import React, {Component, Fragment} from 'react';
import {
    Container, Row, Col, Button,
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, CardGroup,
    CardDeck, CardHeader
} from 'reactstrap';

import {CLIENT_TEAM_NAME} from "../../utils/constants";
import {MISSION_STATEMENT} from "../../utils/constants";
import {MICHAEL_BIO} from "../../utils/constants";
import {CHASE_BIO} from "../../utils/constants";
import {JACOB_BIO} from "../../utils/constants";
import {KORBIN_BIO} from "../../utils/constants";
import {ALEC_BIO} from "../../utils/constants";

import JacobProfileImage from '../../static/images/JacobProfileImage.jpg';
import KorbinProfileImage from '../../static/images/KorbinProfilePhoto.jpg';
import AlecProfileImage from '../../static/images/AlecProfileImage.jpg';
import ChaseProfileImage from '../../static/images/chase.jpg'
import MichaelProfileImage from '../../static/images/michael.jpg';

export default class About extends Component {
	constructor(props) {
		super(props);
		this.team = this.buildTeam();
	}

	render() {
    return (
      <Container id="about">
        {this.renderHeader()}
        {this.renderCardDeck()}
        <p>
        </p>
        <Row>
          <Col id="closeAbout">
            <Button color="primary" onClick={this.props.closePage} block>Close</Button>
          </Col>
        </Row>
      </Container>
    )
  }

  buildTeam() {
    var team = [];
    var teamMember = {name: "Korbin Walsh", profileImageLink: KorbinProfileImage, memberBio: KORBIN_BIO};
    team.push(teamMember);
    teamMember = {name: "Alec Moran", profileImageLink: AlecProfileImage, memberBio: ALEC_BIO};
    team.push(teamMember);
    teamMember = {name: "Chase Howard", profileImageLink: ChaseProfileImage, memberBio: CHASE_BIO};
    team.push(teamMember);
    teamMember = {name: "Jacob Petterle", profileImageLink: JacobProfileImage, memberBio: JACOB_BIO};
    team.push(teamMember);
    teamMember = {name: "Michael Bauers", profileImageLink: MichaelProfileImage, memberBio: MICHAEL_BIO};
    team.push(teamMember);
    return team;
  }

  renderHeader() {
  	return (
  		<Fragment>
        <Row>
          <Col>
            <h2>Our Mission:</h2>
          </Col>
        </Row>
        <Row>
          <Col className="centerItalicize">
            {MISSION_STATEMENT}
          </Col>
        </Row>
        <p>
        </p>
        <Row>
          <Col>
            <h3>{"Our Team:"} </h3>
          </Col>
        </Row>
      </Fragment>
  	);
  }

  renderCardDeck() {
    var cardDeck = [];
    for (var i = 0; i < 2; i++) {
      cardDeck.push(<p></p>);
	    cardDeck.push(
        <Row>
          <Col>
            <CardDeck>
              {this.renderCards(i)}
            </CardDeck>
          </Col>
        </Row>
      );
    }
  	return cardDeck;
  }

  renderCards(index) {
    var cards = [];
    var nextIndex = index * 2 + 3
    for(var i = index * 3; i < nextIndex && i < this.team.length; i++) {
			cards.push(
				<Card body outline color="secondary">
          <CardImg top width="100%" src={this.team[i].profileImageLink} alt={this.team[i].name + "'s beautiful face."} />
          <CardBody>
            <CardTitle tag="h4">{this.team[i].name}</CardTitle>
            <CardText>{this.team[i].memberBio}</CardText>
          </CardBody>
        </Card>
			);
    }
		return cards;
  }
}

