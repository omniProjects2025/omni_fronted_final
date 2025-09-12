import { Component } from '@angular/core';

@Component({
  selector: 'app-board-members',
  templateUrl: './board-members.component.html',
  styleUrls: ['./board-members.component.css']
})
export class BoardMembersComponent {
  leadershipTeam = [
    { name: 'Dr M Goutham Reddy', title: 'Medical Director', image: 'assets/images/leadership.png' },
  ];
}
