|Build Status| |Codecov| |license|

frontend-app-learner-record
=================================

Please tag **@edx/aperture-eng** on any PRs or issues.  Thanks.

Introduction
------------

This is the Learner Record micro-frontend, currently under development by `edX <https://www.edx.org>`_.

The Learner Record provides information about the enrolled programs for a user.

Installation
------------

1. Clone the repository `this repository <https://github.com/edx/frontend-app-learner-record.git>`_

2. Enter the directory

   .. code-block::
      cd frontend-app-learner-record

3. Install dependencies

    .. code-block::
      npm install

4. Start the Learner Record MFE

    .. code-block::
      npm start

The page is currently hosted on http://localhost:8080/


Environment Variables/Setup Notes
---------------------------------

This MFE will use a REST API from the Credentials IDA located at credentials/apps/records/rest_api

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