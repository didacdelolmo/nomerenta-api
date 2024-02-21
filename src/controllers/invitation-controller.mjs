import constants from '../config/constants.mjs';
import * as invitationService from '../services/invitation-service.mjs';

export async function createCurrentUserInvitations(req, res) {
  res.send(
    await invitationService.createMany(
      req.session.userId,
      req.body.email,
      constants.DEFAULT_USER_INVITATIONS
    )
  );
}

// export async function createUserInvitations(req, res) {
//   res.send(
//     await invitationService.create(
//       req.body.userId,
//       req.body.email,
//       req.body.amount,
//       req.body.reusable
//     )
//   );
// }
