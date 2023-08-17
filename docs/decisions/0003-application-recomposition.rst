3. Application re-composition
#############################

Status
******

Accepted

Context
*******

The Learner Record MFE started as a single-featured, naively-structured application that has reimplemented the legacy markup almost as one-to-one transfer.

It was Ok to have a simple flat components layer with an inline state management until a new feature was introduced.

Open edX Credentials IDA is developing the Verifiable Credentials feature. It is decided to extend Learner Record MFE with a new corresponding UI.

Now at least 2 features are present:

* Learner Records
* Verifiable Credentials

This update pushes the overall application structure to be re-composed, so it is ready for further development.

Decision
********

Modules structure
-----------------

.. note::
    The most of the following updates are described in the `ADR 0002`_.

#. We will put each feature under its sub-tree.

    ::

        assets/
        components/
        i18n/
        ...
        learner-record/
            index.js
            <view components>

        verifiable-credentials/
            index.js
            <view components>

#. Current ``components`` items will be split. The most parts (learner-record feature related) go under the ``learner-record/``. Some component may become top level (those which form overall application skeleton, pages, sections - e.g. Head, etc.). The ``components`` directory itself will be removed.

    ::

        assets/
        i18n/
        ...
        Head/
        learner-record/
            index.js
            index.scss
            ProgramRecord/
            ProgramRecordAlert/
            <other view components>

        verifiable-credentials/
            index.js
            <view components>

#. Being a single feature Learner Records was responsible for some generic UI pieces. Now we'll introduce a top level navigation which pushes those generic UI to be extracted from the Learner Records.

    * a new top level page component will be introduced (generic navigation actions carrying):
        * "Back to My Profile" navigation
        * features tabs switching (new UI/UX)
    * ProgramRecordList component responsibilities will be reduced to its own functions:
        * Record items rendering (with helpers);
        * main container rendering goes away;
        * back-to-profile navigation goes away;

#. Data management will be extracted under ``data`` directories.

    .. note::
        We can postpone Learner Record data management refactoring for now (as a tech debt).

    ::

        assets/
        i18n/
        ...
        Head/
        learner-record/
            data/
            index.js
            index.scss
            ProgramRecord/
            ProgramRecordAlert/
            <other view components>

        verifiable-credentials/
            data/
            index.js
            index.scss
            <view components>

Routing
-------

Current application routes map is designed as a Learner Records feature-centric:

    ::

        / => ProgramRecordsList
        /:programUUID => ProgramRecord (private)
        /shared/:programUUID => ProgramRecord (public)

Having other features requires additional namespacing:

    ::

        / => /program-records/
        /program-records/ => ProgramRecordsList
        /program-records/:programUUID => ProgramRecord (private)
        /program-records/shared/:programUUID => ProgramRecord (public)
        /verifiable-credentials/

    * Learner Records routes (all current routes) go under ``/program-records`` path;
    * Verifiable Credentials routes are added under ``/verifiable-credentials`` path;
    * root (main home) route is set as redirect to the default feature (Learner Records home);

State management
----------------

Currently, Redux store isn't used at all - everything is managed via local React state. That was Ok for the initial steps, but having another feature we should start global state management. `We can leverage a lot from the Redux (RTK)`_.

Services (API)
--------------

.. note::
    This item continues the State Management point.

At this point, the micro-frontend has a few interactions (data fetches) with a single backend API. We use ``getAuthenticatedHttpClient`` on a low level (e.g. directly, each time it's configured), and then handle the API request results (e.g. error checking, loading states, etc.).

`RTK Query`_ has a bunch of convenient tools that make everything more comprehensive - `eliminating the need to hand-write data fetching & caching logic yourself`.

Consequences
************

Implementation of the suggested updates should make multi-featured application more clean and ready for future extensions.

Additional effort is needed though with possible refactoring of already implemented functionality.
A combination of the three: Redux + RTK + RTK Query involves some learning/understanding curve.

Rejected Alternatives
*********************

The most straight-forward alternative would be to leave each item as it is used now and add the Verifiable Credentials feature in a similar manner (possibly, mixing features in different ways).

References
**********

.. _ADR 0002: https://github.com/openedx/frontend-app-learner-record/blob/master/docs/decisions/0002-feature-based-application-organization.rst

.. _We can leverage a lot from the Redux (RTK) : https://discuss.openedx.org/t/providence-better-state-management-for-react-and-mfes/7895/2

.. _RTK Query : https://redux-toolkit.js.org/rtk-query/overview

.. _Documenting Architecture Decisions: https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
