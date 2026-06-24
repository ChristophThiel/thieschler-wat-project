@wat
Feature: User extended
  As an admin
  I want to change a user's role so their permissions match their responsibilities

  Scenario: admin changes a user's role
    Given "Admin" creates following user using API
      | id     |
      | Michel |
    And "Admin" logs in
    And "Admin" opens the "admin-settings" app
    And "Admin" navigates to the users management page
    And "Admin" sets the following filter
      | filter | values |
      | roles  | User   |
    Then "Admin" should see the following users
      | user   |
      | Michel |
    When "Admin" changes role to "Space Admin" for user "Michel" using the sidebar panel
    And "Admin" sets the following filter
      | filter | values      |
      | roles  | Space Admin |
    Then "Admin" should see the following users
      | user   |
      | Michel |
    And "Admin" logs out
