const { randomUUID } = require('crypto');
const { sequelize, Role, Site, User, UserSite } = require('../../models');
const { hashPassword } = require('../../utils/password');
const { ROLES } = require('../../constants/roles');

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'password123';
const HQ_SITE_CODE = 'HQ-001';

async function ensureHqRole(transaction) {
  const [role] = await Role.findOrCreate({
    where: {
      name: ROLES.HQ_SAFETY_OFFICER
    },
    defaults: {
      id: randomUUID(),
      name: ROLES.HQ_SAFETY_OFFICER,
      description: 'Central OHS authority'
    },
    transaction
  });

  return role;
}

async function ensureHqSite(transaction) {
  const [site] = await Site.findOrCreate({
    where: {
      code: HQ_SITE_CODE
    },
    defaults: {
      id: randomUUID(),
      code: HQ_SITE_CODE,
      name: 'Corporate Headquarters',
      region: 'Central',
      country: 'Bhutan',
      address: 'Thimphu Corporate Office',
      siteType: 'Head Office',
      isActive: true
    },
    transaction
  });

  return site;
}

async function seedAdminUser() {
  const passwordHash = await hashPassword(ADMIN_PASSWORD);

  await sequelize.transaction(async (transaction) => {
    const role = await ensureHqRole(transaction);
    const site = await ensureHqSite(transaction);

    const [user] = await User.findOrCreate({
      where: {
        email: ADMIN_EMAIL
      },
      defaults: {
        id: randomUUID(),
        roleId: role.id,
        firstName: 'System',
        lastName: 'Admin',
        email: ADMIN_EMAIL,
        phoneNumber: '+97517110005',
        employeeCode: 'EMP-ADM-001',
        passwordHash,
        department: 'Administration',
        teamName: 'HQ Administration',
        isActive: true
      },
      transaction
    });

    await user.update(
      {
        roleId: role.id,
        firstName: 'System',
        lastName: 'Admin',
        phoneNumber: '+97517110005',
        employeeCode: user.employeeCode || 'EMP-ADM-001',
        passwordHash,
        department: 'Administration',
        teamName: 'HQ Administration',
        isActive: true
      },
      { transaction }
    );

    const [userSite] = await UserSite.findOrCreate({
      where: {
        userId: user.id,
        siteId: site.id
      },
      defaults: {
        id: randomUUID(),
        userId: user.id,
        siteId: site.id,
        isPrimary: true
      },
      transaction
    });

    if (!userSite.isPrimary) {
      await userSite.update(
        { isPrimary: true },
        { transaction }
      );
    }
  });

  process.stdout.write(`Seeded admin user: ${ADMIN_EMAIL}\n`);
}

if (require.main === module) {
  seedAdminUser()
    .then(async () => {
      process.stdout.write('Admin user seed complete.\n');
      await sequelize.close();
    })
    .catch(async (error) => {
      process.stderr.write(`${error.stack || error.message}\n`);
      await sequelize.close();
      process.exit(1);
    });
}

module.exports = seedAdminUser;
