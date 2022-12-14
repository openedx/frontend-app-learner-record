frontend-app-learner-record
#############################


|Build Status| |Codecov| |license|

Purpose
*******

The Learner Record provides information about the enrolled programs for a user. 
It contains views for a learners current status in a program, their current grade, and the ability to share any earned credentials either publically or with institutions.

This is the Learner Record micro-frontend, currently under development by `edX <https://www.edx.org>`_.

Getting Started
***************

Developing
==========

One Time Setup
--------------
.. code-block::

  # Clone the repository via SSH
  git clone git@github.com:openedx/frontend-app-learner-record.git

  # Enter the directory
    cd frontend-app-learner-record

  # Clean Install dependencies
    npm ci

  # Start the Learner Record MFE
    npm start

The page will then be hosted on http://localhost:1990/

Every time you develop something in this repo
---------------------------------------------
.. code-block::

  # Grab the latest code
    git fetch
    git pull

  # Make a new branch for your changes
    git checkout -b <your_github_username>/<short_description>

  # Clean install/update the dev requirements
    npm ci

  # Start the Learner Record MFE
    npm start
  
  # Using your favorite editor, edit the code to make your change.
    vim ...

  # Run the tests after making changes (to verify the status before you make any changes)
    npm test

  # Commit all your changes
    git commit ...
    git push

  # Open a PR and ask for review after the github CI has passed.

Environment Variables/Setup Notes
---------------------------------

Currently, this MFE is not intergrated into the devstack, and must be run locally. This MFE requires credentials to be running, and will use a REST API from the Credentials IDA located at `credentials/apps/records/rest_api`.

Credentials uses 2 enviroment variables to link to this MFE:

* ``USE_LEARNER_RECORD_MFE`` -- Toggles the navigation in credentials to redirect to this MFE
* ``LEARNER_RECORD_MFE_RECORDS_PAGE_URL`` -- The URL for the base URL of this MFE

More details for these flags can be found in the base configuration of credentials: ``credentials/settings/base``
This MFE has 2 flags of its own:

* ``SUPPORT_URL_LEARNER_RECORDS`` -- A link to a help/support center for learners who run into problems whilst trying to share their records
* ``USE_LR_MFE`` -- A toggle that when on, uses the MFE to host shared records instead of the the old UI inside of credentials

Project Structure
-----------------

The source for this project is organized into nested submodules according to the ADR `Feature-based Application Organization <https://github.com/edx/frontend-template-application/blob/master/docs/decisions/0002-feature-based-application-organization.rst>`_.

Deploying
=========

**Production Build**

The production build is created with ``npm run build``.

General deployment information can be found in the `Microfrontend onboarding`_ documentation, along with other MFE implementation details.

.. _Microfrontend onboarding: https://openedx.atlassian.net/wiki/spaces/FEDX/pages/2629829454/Micro+Frontend+MFE+Onboarding#Deployment


Getting Help
************
More Help
=========

If you're having trouble, we have discussion forums at
https://discuss.openedx.org where you can connect with others in the
community.

Our real-time conversations are on Slack. You can request a `Slack
invitation`_, then join our `community Slack workspace`_.

For anything non-trivial, the best path is to open an issue in this
repository with as many details about the issue you are facing as you
can provide.

https://github.com/openedx/frontend-app-learner-record/issues

For more information about these options, see the `Getting Help`_ page.

.. _Slack invitation: https://openedx.org/slack
.. _community Slack workspace: https://openedx.slack.com/
.. _Getting Help: https://openedx.org/getting-help

License
*******

The code in this repository is licensed under the `GNU AFFERO GENERAL PUBLIC LICENSE` unless
otherwise noted.

Please see `LICENSE.txt <LICENSE.txt>`_ for details.

Contributing
************

Contributions are very welcome.
Please read `How To Contribute <https://openedx.org/r/how-to-contribute>`_ for details.

This project is currently accepting all types of contributions, bug fixes,
security fixes, maintenance work, or new features.  However, please make sure
to have a discussion about your new feature idea with the maintainers prior to
beginning development to maximize the chances of your change being accepted.
You can start a conversation by creating a new issue on this repo summarizing
your idea.

The Open edX Code of Conduct
****************************

All community members are expected to follow the `Open edX Code of Conduct`_.

.. _Open edX Code of Conduct: https://openedx.org/code-of-conduct/

People
******

The assigned maintainers for this component and other project details may be
found in `Backstage`_. Backstage pulls this data from the ``catalog-info.yaml``
file in this repo.

.. _Backstage: https://open-edx-backstage.herokuapp.com/catalog/default/component/{{ cookiecutter.repo_name }}

Reporting Security Issues
*************************

Please do not report security issues in public. Please email security@tcril.org.

.. |Build Status| image:: https://api.travis-ci.com/edx/frontend-app-learner-record.svg?branch=master
   :target: https://travis-ci.com/edx/frontend-app-learner-record
.. |Codecov| image:: https://codecov.io/gh/edx/frontend-app-learner-record/branch/master/graph/badge.svg
   :target: https://codecov.io/gh/edx/frontend-app-learner-record
.. |license| image:: https://img.shields.io/npm/l/@edx/frontend-app-learner-record.svg
   :target: https://github.com/openedx/frontend-app-learner-record/blob/master/LICENSE