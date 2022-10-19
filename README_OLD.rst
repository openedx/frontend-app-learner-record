|Build Status| |Codecov| |license|

frontend-app-learner-record
=================================

Please tag **@edx/aperture-eng** on any PRs or issues.  Thanks.

Introduction
------------

This is the Learner Record micro-frontend, currently under development by `edX <https://www.edx.org>`_.

The Learner Record provides information about the enrolled programs for a user.

Local Development
-----------------

1. Clone the repository `this repository <https://github.com/edx/frontend-app-learner-record.git>`_

2. Enter the directory

    .. code-block::

      cd frontend-app-learner-record

3. Clean Install dependencies

    .. code-block::

      npm ci

4. Start the Learner Record MFE

    .. code-block::

      npm start

The page is currently hosted on http://localhost:1990/


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

Build Process Notes
-------------------

**Production Build**

The production build is created with ``npm run build``.

Internationalization
--------------------

Please see `edx/frontend-platform's i18n module <https://edx.github.io/frontend-platform/module-Internationalization.html>`_ for documentation on internationalization.  The documentation explains how to use it, and the `How To <https://github.com/edx/frontend-i18n/blob/master/docs/how_tos/i18n.rst>`_ has more detail.

.. |Build Status| image:: https://api.travis-ci.com/edx/frontend-app-learner-record.svg?branch=master
   :target: https://travis-ci.com/edx/frontend-app-learner-record
.. |Codecov| image:: https://codecov.io/gh/edx/frontend-app-learner-record/branch/master/graph/badge.svg
   :target: https://codecov.io/gh/edx/frontend-app-learner-record
.. |license| image:: https://img.shields.io/npm/l/@edx/frontend-app-learner-record.svg
   :target: @edx/frontend-app-learner-record

Known Issues
------------


Development Roadmap
-------------------

The following is a list of current short-term development targets, in (rough) descending order of priority:

Learner Record MFE Epic: `https://openedx.atlassian.net/browse/MICROBA-1296`_

* Set up automated deployment for MFE
* Implement Learner Record MFE to mirror the currently existing Learner Record page
* Add user masquerading
* Update Profile MFE to redirect to new Learner Record MFE
* Set up automated dependency updates

==============================
